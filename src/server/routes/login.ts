import express from 'express'
import passport from 'passport'

import { PUBLIC_URL } from '@config'

const loginRouter = express.Router()

const fallbackUrl = PUBLIC_URL.length > 0 ? PUBLIC_URL : '/'

const getSafeReturnUrl = (rawReturnUrl: unknown, req: express.Request) => {
  if (typeof rawReturnUrl !== 'string' || !rawReturnUrl) {
    return fallbackUrl
  }

  try {
    const requestHost = req.get('x-forwarded-host') ?? req.get('host')
    const parsedUrl = new URL(rawReturnUrl, `http://${requestHost}`)

    if (!requestHost || parsedUrl.host !== requestHost) {
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

loginRouter.get('/callback', passport.authenticate('oidc', { failureRedirect: fallbackUrl }), (req, res) => {
  const returnUrl = req.session?.returnUrl ?? fallbackUrl
  delete req.session.returnUrl
  res.redirect(returnUrl)
})

export default loginRouter
