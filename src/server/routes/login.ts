import express from 'express'
import passport from 'passport'

import { PUBLIC_URL } from '@config'

const loginRouter = express.Router()

loginRouter.get('/', (req, res, next) => {
  const returnUrl = req.query.returnUrl as string
  if (returnUrl) {
    req.session.returnUrl = returnUrl
  }
  passport.authenticate('oidc')(req, res, next)
})

loginRouter.get('/callback', passport.authenticate('oidc', { failureRedirect: PUBLIC_URL || '/' }), (req, res) => {
  const returnUrl = req.session?.returnUrl || PUBLIC_URL || '/'
  delete req.session.returnUrl
  res.redirect(returnUrl)
})

export default loginRouter
