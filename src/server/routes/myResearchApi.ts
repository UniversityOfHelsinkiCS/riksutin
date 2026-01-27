import express from 'express'

import { getRisksWithTuhatProject, getRiskWithTuhatProjectId } from '../services/myResearchApi'
import { MyResearchData, Error } from '@server/types'
import { validateApiKey } from '../middleware/apiKey'

const myResearchApiRouter = express.Router()

myResearchApiRouter.get<never, MyResearchData[] | Error, never, never>(
  '/projects',
  validateApiKey,
  async (req, res) => {
    const tuhatProjects = await getRisksWithTuhatProject()

    return res.send(tuhatProjects)
  }
)

myResearchApiRouter.get<never, MyResearchData | Error, never, never>(
  '/projects/:projectUuid',
  validateApiKey,
  async (req, res) => {
    const { projectUuid } = req.params
    const tuhatProjects = await getRiskWithTuhatProjectId(projectUuid)

    return res.send(tuhatProjects)
  }
)

export default myResearchApiRouter
