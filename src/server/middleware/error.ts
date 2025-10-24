import { Request, Response, NextFunction } from 'express'
import { ValidationError, UniqueConstraintError } from 'sequelize'

import * as Sentry from '@sentry/node'

import { inProduction } from '@config'
import logger from '../util/logger'

import ZodValidationError from '../errors/ValidationError'
import { User } from '@types'

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${error.message} ${error.name} ${error.stack}`)

  const user = req.user as User

  if (inProduction) {
    if (user) {
      // eslint-disable-next-line no-console
      console.log('USER added to sentry')
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
      })
    } else {
      // eslint-disable-next-line no-console
      console.log('NO USER added to sentry')
    }

    Sentry.captureException(error)
  }

  if (error.name === 'ZodValidationError') {
    return res.status(400).send({
      error: error.message,
      data: (error as ZodValidationError).errors,
    })
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({ error: error.message, data: (error as ValidationError).errors })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).send({
      error: error.message,
      data: (error as UniqueConstraintError).errors,
    })
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).send({
      error: error.message,
      data: null,
    })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).send({
      error: error.message,
      data: null,
    })
  }

  return next(error)
}

export default errorHandler
