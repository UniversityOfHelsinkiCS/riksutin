import express from 'express'

import type { RequestWithUser } from '@backend/types'

import adminHandler from '../middleware/admin'
import {
  createResult,
  deleteResult,
  getResults,
  updateResult,
} from '../services/result'

const resultRouter = express.Router()

resultRouter.get('/:surveyId', async (req, res) => {
  const { surveyId } = req.params

  const results = await getResults(surveyId)

  return res.send(results)
})

export default resultRouter

resultRouter.put(
  '/:id',
  adminHandler,
  async (req: RequestWithUser, res: any) => {
    const { id } = req.params

    const updatedResult = await updateResult(id, req.body)

    return res.send(updatedResult)
  }
)

resultRouter.post(
  '/:surveyId',
  adminHandler,
  async (req: RequestWithUser, res: any) => {
    const { surveyId } = req.params

    const newResult = await createResult(surveyId, req.body)

    return res.status(201).send(newResult)
  }
)

resultRouter.delete(
  '/:id',
  adminHandler,
  async (req: RequestWithUser, res: any) => {
    const { id } = req.params

    const deletedResult = await deleteResult(id)

    return res.status(204).send(deletedResult)
  }
)
