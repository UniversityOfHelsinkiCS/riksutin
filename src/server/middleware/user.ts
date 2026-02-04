import { NextFunction, Response } from 'express'
import UnauthorizedError from '../errors/UnauthorizedError'

const userAccessHandler = (req, res: Response, next: NextFunction) => {
  const hasAccess = req?.user?.iamGroups?.some((group: string) => ['hy-employees', 'grp-hyplus-kaikki'].includes(group))

  if (!hasAccess) {
    throw new UnauthorizedError('Unauthorized')
  }

  return next()
}

export default userAccessHandler
