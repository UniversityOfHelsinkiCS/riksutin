import { getMockUser } from '../mocs/user'

const mockUserMiddleware = (req, _, next) => {
  if (req.path.includes('/login')) {
    return next()
  }

  req.user = getMockUser()

  return next()
}

export default mockUserMiddleware
