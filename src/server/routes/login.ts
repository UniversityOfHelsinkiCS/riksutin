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
  req.session.returnUrl = getSafeReturnUrl(req.query.returnUrl)
  passport.authenticate('oidc')(req, res, next)
})

loginRouter.get('/callback', passport.authenticate('oidc', { failureRedirect: fallbackUrl }), (req, res) => {
  const returnUrl = req.session?.returnUrl ?? fallbackUrl
  delete req.session.returnUrl
  res.redirect(returnUrl)
})

export default loginRouter
