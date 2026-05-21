import express from 'express'
import passport from 'passport'

import { PUBLIC_URL } from '@config'

const loginRouter = express.Router()

const getSafeReturnUrl = (rawReturnUrl: unknown, req: express.Request) => {
  const fallbackUrl = PUBLIC_URL || '/'

  if (typeof rawReturnUrl !== 'string' || !rawReturnUrl) {
    return fallbackUrl
  }

  try {
    const currentOrigin = `${req.protocol}://${req.get('host')}`
    const parsedUrl = new URL(rawReturnUrl, currentOrigin)

    if (parsedUrl.origin !== currentOrigin) {
      return fallbackUrl
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
  } catch {
    return rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//') ? rawReturnUrl : fallbackUrl
  }
}

loginRouter.get('/', (req, res, next) => {
  req.session.returnUrl = getSafeReturnUrl(req.query.returnUrl, req)
  passport.authenticate('oidc')(req, res, next)
})

loginRouter.get('/callback', passport.authenticate('oidc', { failureRedirect: PUBLIC_URL || '/' }), (req, res) => {
  const fallbackUrl = PUBLIC_URL.length > 0 ? PUBLIC_URL : '/'
  const returnUrl = req.session?.returnUrl ?? fallbackUrl
  delete req.session.returnUrl
  res.redirect(returnUrl)
})

export default loginRouter
