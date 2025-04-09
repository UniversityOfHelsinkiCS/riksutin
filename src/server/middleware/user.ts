import mockUser from '../mocs/user'

const userMiddleware = (req, _, next) => {
  if (req.path.includes('/login')) return next()

  req.user = mockUser

  return next()
}

export default userMiddleware
