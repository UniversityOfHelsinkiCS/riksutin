import { NextFunction, Response } from 'express'
import UnauthorizedError from '../errors/UnauthorizedError'

export const ensureEmployee = (req, res: Response, next: NextFunction) => {
  const hasAccess = req?.user?.iamGroups?.some((group: string) => ['hy-employees', 'grp-hyplus-kaikki'].includes(group))

  if (!hasAccess) {
    throw new UnauthorizedError('Unauthorized')
  }

  return next()
}

export const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized')
  }

  next()
}
