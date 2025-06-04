import express from 'express'

import { getWarnings, getWarningWithId, createWarning } from '../services/warning'
import type { RequestWithUser } from '@server/types'
import adminHandler from '../middleware/admin'

const warningsRouter = express.Router()

warningsRouter.get('/', async (_req, res) => {
  //const { warning } = req.params
  const results = await getWarnings()
  return res.send(results)
})

warningsRouter.get('/:id', async (req, res) => {
  //const { warning } = req.params
  const { id } = req.params
  const results = await getWarningWithId(Number(id))
  return res.send(results)
})

warningsRouter.post('/', adminHandler, async (req: RequestWithUser, res: any) => {
  try {
    //const { id } = req.params
    //const { country } req.params
    //console.log("warn0")

    const newWarning = await createWarning(req.body)

    //console.log("warn1")
    return res.status(201).send(newWarning)
  } catch (error: any) {
    // console.log("warn2")
    res.status(400).send({ error: error.message })
  }
})

export default warningsRouter
