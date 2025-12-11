import express from 'express'

import { getRisksWithTuhatProject, getRiskWithTuhatProjectId } from '../services/myResearchApi'
import { MyResearchData, Error } from '@server/types'
import { HYAPI_TOKEN } from '@userconfig'

const myResearchApiRouter = express.Router()

myResearchApiRouter.get<never, MyResearchData[] | Error, never, never>('/projects', async (req, res) => {
  const apiKey = req.get('api-key')

  if (!apiKey || !HYAPI_TOKEN || apiKey !== HYAPI_TOKEN) {
    return res.status(401).json({ error: 'unauthorised' })
  }

  const tuhatProjects = await getRisksWithTuhatProject()

  return res.send(tuhatProjects)
})

myResearchApiRouter.get<never, MyResearchData | Error, never, never>('/projects/:projectUuid', async (req, res) => {
  const apiKey = req.get('api-key')
  if (!apiKey || !HYAPI_TOKEN || apiKey !== HYAPI_TOKEN) {
    return res.status(401).json({ error: 'unauthorised' })
  }
  const { projectUuid } = req.params
  const tuhatProjects = await getRiskWithTuhatProjectId(projectUuid)

  return res.send(tuhatProjects)
})

export default myResearchApiRouter
