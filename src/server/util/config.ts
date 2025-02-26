import * as dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })

export const PORT = process.env.PORT ?? 8000
export const SESSION_SECRET = process.env.SESSION_SECRET ?? ''
export const REDIS_HOST = process.env.REDIS_HOST ?? 'redis'
export const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://postgres:postgres@db:5432/postgres'
