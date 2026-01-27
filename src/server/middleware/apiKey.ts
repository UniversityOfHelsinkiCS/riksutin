import type { Request, Response, NextFunction } from 'express'
import { HY_API_TOKEN } from '@userconfig'

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.get('api-key')
  if (!apiKey || !HY_API_TOKEN || apiKey !== HY_API_TOKEN) {
    return res.status(401).json({ error: 'unauthorised' })
  }
  next()
}
