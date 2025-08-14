import express from 'express'

import { getTuhatProjects } from '../services/tuhatProject'

const tuhatProjectRouter = express.Router()

tuhatProjectRouter.get<never, any[], never, { userid: string }>('/', async (req, res) => {
  const { userid = '' } = req.query

  const tuhatProjects = await getTuhatProjects(userid)

  return res.send(tuhatProjects)
})

export default tuhatProjectRouter
