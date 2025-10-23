import Redis from 'ioredis'
import { RedisStore } from 'connect-redis'

import { REDIS_HOST } from '@server/config'

import { Cache } from '@dbmodels'

export const redis = new Redis({
  host: REDIS_HOST,
  port: 6379,
})

export const redisStore = new RedisStore({
  client: redis,
})

export const get = async <T>(key: string): Promise<T | null> => {
  const value = await redis.get(key)
  return JSON.parse(value ?? 'null')
}

export const getPermanent = async (key: string) => {
  const row = await Cache.findOne({ where: { key } })

  return row?.value
}

export const setPermanent = async <T>(key: string, value: T) => {
  // we are also saving the cached data to psql, just in case if something blows up...
  const existing = await Cache.findOne({ where: { key } })
  if (existing) {
    await existing.update({ value: value as unknown as object })
  } else {
    await Cache.create({ key, value: value as unknown as object })
  }

  await redis.set(key, JSON.stringify(value))
}
