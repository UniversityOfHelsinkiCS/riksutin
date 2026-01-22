import { NextFunction, Response } from 'express'
import UnauthorizedError from '../errors/UnauthorizedError'

const userAccessHandler = (req, res: Response, next: NextFunction) => {
  if (!req?.user?.iamGroups?.includes('hy-employees')) {
    throw new UnauthorizedError('Unauthorized')
  }

  return next()
}

export default userAccessHandler
