import Redis from 'ioredis'
import { RedisStore } from 'connect-redis'

import { REDIS_HOST } from '@server/config'

import { Cache } from '@dbmodels'

const ttl = 60 * 60 * 24 * 30 // 30 days

export const redis = new Redis({
  host: REDIS_HOST,
  port: 6379,
})

export const redisStore = new RedisStore({
  client: redis,
})

export const set = async <T>(key: string, value: T) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl)
}

export const get = async <T>(key: string): Promise<T | null> => {
  const value = await redis.get(key)
  return JSON.parse(value ?? 'null')
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
