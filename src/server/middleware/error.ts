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
    // User context should already be set by sentryUserMiddleware
    // Just add error-specific context and capture the exception
    Sentry.withScope(scope => {
      if (user) {
        // eslint-disable-next-line no-console
        console.log('Error occurred for user:', { id: user.id, email: user.email, username: user.username })
      } else {
        // eslint-disable-next-line no-console
        console.log('Error occurred for anonymous user')
      }

      // Add error-specific context
      scope.setContext('error', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      Sentry.captureException(error)
    })
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
