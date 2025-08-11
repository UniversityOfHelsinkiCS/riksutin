import express from 'express'

import type { RequestWithUser } from '@server/types'

import { getTuhatProjects } from '../services/tuhatProject'

const tuhatProjectRouter = express.Router()

tuhatProjectRouter.get('/', async (req: RequestWithUser, res: any) => {
  const { id } = req.user

  const tuhatProjects = await getTuhatProjects(id)

  return res.send(tuhatProjects)
})

export default tuhatProjectRouter
