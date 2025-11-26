import { NextFunction, Response } from 'express'
import UnauthorizedError from '../errors/UnauthorizedError'

const adminHandler = (req, res: Response, next: NextFunction) => {
  if (!req?.user.isAdmin) {
    throw new UnauthorizedError('Unauthorized')
  }

  return next()
}

export default adminHandler
