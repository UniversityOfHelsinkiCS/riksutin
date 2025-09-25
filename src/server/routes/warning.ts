import express from 'express'

import { getWarnings, getWarningWithId, createWarning, deleteWarning, updateWarning } from '../services/warning'
import type { RequestWithUser } from '@server/types'
import adminHandler from '../middleware/admin'

const warningsRouter = express.Router()

warningsRouter.get('/', async (_req, res) => {
  const results = await getWarnings()
  return res.send(results)
})

warningsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const results = await getWarningWithId(String(id))
  return res.send(results)
})

warningsRouter.post('/', adminHandler, async (req: RequestWithUser, res: any) => {
  try {
    const newWarning = await createWarning(req.body)
    return res.status(201).send(newWarning)
  } catch (error: any) {
    res.status(400).json({ error: 'routevirhe: ' + error.message })
  }
})

warningsRouter.delete('/:id', adminHandler, async (req: RequestWithUser, res: any) => {
  const { id } = req.params
  const deletedWarning = await deleteWarning(id)
  return res.status(204).send(deletedWarning)
})

warningsRouter.put('/:id', adminHandler, async (req: RequestWithUser, res: any) => {
  try {
    const { id } = req.params
    const updatedResult = await updateWarning(id, req.body)
    return res.send(updatedResult)
  } catch (error: any) {
    res.status(400).json({ error: 'routevirhe: ' + error.message })
  }
})

export default warningsRouter
