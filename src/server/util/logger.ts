import winston from 'winston'
import LokiTransport from 'winston-loki'

import { inProduction } from '@config'

const { combine, timestamp, printf, splat } = winston.format

const LOKI_HOST = 'http://loki-svc.toska-lokki.svc.cluster.local:3100'

const transports: winston.transport[] = []
if (!inProduction) {
  transports.push(new winston.transports.File({ filename: 'debug.log' }))
  const devFormat = printf(({ level, message, timestamp: time, ...meta }) => {
    let restStr = ''
    try {
      restStr = JSON.stringify(meta)
    } catch (_) {
      restStr = '[unserializable]'
    }
    return `${time} ${level}: ${message} ${restStr}`
  })

  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: combine(splat(), timestamp(), devFormat),
    })
  )
} else {
  const levels: { [key: string]: number } = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  }

  const prodFormat = printf(({ level, message, timestamp, ...meta }) => {
    let logMessage = `${timestamp} ${levels[level]}: ${message}`
    if (Object.keys(meta ?? {}).length > 0) {
      logMessage = `${logMessage} ${JSON.stringify(meta)}`
    }
    return logMessage
  })

  transports.push(
    new winston.transports.Console({
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prodFormat),
    })
  )

  transports.push(
    new LokiTransport({
      host: LOKI_HOST,
      labels: { app: 'riksutin', environment: process.env.NODE_ENV ?? 'production' },
    })
  )
}

const logger = winston.createLogger({ transports })

export default logger
