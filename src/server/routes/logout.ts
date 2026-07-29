import express from 'express'
import { LOGOUT_REDIRECT_URL } from '../../config'

const logoutRouter = express.Router()

logoutRouter.get('/', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
  })

  res.redirect(LOGOUT_REDIRECT_URL)
})

export default logoutRouter
