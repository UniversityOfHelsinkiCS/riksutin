import express from 'express'

import type { RequestWithUser } from '@server/types'

const userRouter = express.Router()

userRouter.get('/', (req: RequestWithUser, res) => {
  return res.send({ ...req?.user })
})

export default userRouter
