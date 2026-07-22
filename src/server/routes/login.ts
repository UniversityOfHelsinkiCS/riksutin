import express from 'express'
import passport from 'passport'

import { PUBLIC_URL } from '@config'

const loginRouter = express.Router()

const fallbackUrl = PUBLIC_URL.length > 0 ? PUBLIC_URL : '/'

const getSafeReturnUrl = (rawReturnUrl: unknown) => {
  if (typeof rawReturnUrl !== 'string' || !rawReturnUrl) {
    return fallbackUrl
  }

  if (rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')) {
    return rawReturnUrl
  }

  try {
    const parsedUrl = new URL(rawReturnUrl)

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
  } catch {
    return fallbackUrl
  }
}

loginRouter.get('/', (req, res, next) => {
  const safeReturnUrl = getSafeReturnUrl(req.query.returnUrl)
  req.session.returnUrl = safeReturnUrl
  passport.authenticate('oidc')(req, res, next)
})

loginRouter.get('/callback', (req, res, next) => {
  const returnUrl = req.session?.returnUrl ?? fallbackUrl
  delete req.session.returnUrl
  passport.authenticate('oidc', { successRedirect: returnUrl, failureRedirect: fallbackUrl })(req, res, next)
})

export default loginRouter
