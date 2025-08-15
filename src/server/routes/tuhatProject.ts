import express from 'express'

import { getTuhatProjects } from '../services/tuhatProject'

const tuhatProjectRouter = express.Router()

tuhatProjectRouter.get<never, any[], never, { projectOwnerId: string }>('/', async (req, res) => {
  const { projectOwnerId = '' } = req.query

  const tuhatProjects = await getTuhatProjects(projectOwnerId)

  return res.send(tuhatProjects)
})

export default tuhatProjectRouter
