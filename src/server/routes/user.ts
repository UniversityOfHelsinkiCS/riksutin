import express from 'express'

import type { RequestWithUser } from '@backend/types'

const userRouter = express.Router()

userRouter.get('/', async (req: RequestWithUser, res: any) => {
  const { user } = req

  if (!user) return res.send({})

  return res.send({ ...user, newUser: false })
})

export default userRouter
