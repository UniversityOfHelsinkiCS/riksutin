import express from 'express'

import type { EntryValues, RequestWithUser } from '@server/types'

import { Entry } from '@dbmodels'
import { riskReEvaluation } from '../util/cron/riskReEvaluation/riskReEvaluation'
import createRiskData from '../util/algorithm/createRiskData'
import adminHandler from '../middleware/admin'
import { createEntry, getEntries, getEntry, getUserEntries } from '../services/entry'
import { createPdfResult } from '../services/pdfResult'

const entryRouter = express.Router()

entryRouter.get('/', adminHandler, async (req, res) => {
  const entries = await getEntries()

  return res.status(200).send(entries)
})

entryRouter.get('/user', async (req: RequestWithUser, res: any) => {
  const userId = req.user?.id
  const entries = await getUserEntries(userId)
  return res.status(200).send(entries)
})

entryRouter.get('/:entryId', async (req: RequestWithUser, res: any) => {
  const { entryId } = req.params
  const userId = req.user?.id

  const entry = await getEntry(entryId, userId)

  return res.status(200).send(entry)
})

entryRouter.get('/:entryId/update', async (req: RequestWithUser, res: any) => {
  const { entryId } = req.params
  const userId = req.user?.id

  const entry = await getEntry(entryId, userId)
  const updatedRisks = await riskReEvaluation(entry)

  if (!updatedRisks) return null

  await entry.update({
    data: updatedRisks,
  })

  const updatedObject = await entry.save({ fields: ['data'] })

  return res.status(200).send(updatedObject)
})

entryRouter.delete('/:entryId/delete', async (req: RequestWithUser, res: any) => {
  const { entryId } = req.params
  if (!req.user?.isAdmin) throw new Error('Unauthorized')

  const entry = await Entry.findByPk(entryId)

  if (!entry) return res.status(404).send('Entry not found')

  await entry.destroy()

  return res.status(204).send()
})

entryRouter.post('/:surveyId', async (req: RequestWithUser, res: any) => {
  const { surveyId } = req.params
  const { sessionToken, data } = req.body
  const userId = req.user?.id || `publicUser-${sessionToken}`

  const riskData = await createRiskData(data)

  if (!riskData) return res.status(500).send('Error when calculating risks')

  const updatedData: EntryValues = { sessionToken, data: riskData }

  const entry = await createEntry(userId, surveyId, updatedData)

  return res.status(201).send(entry.data)
})

entryRouter.post('/:entryId/pdf', adminHandler, async (req: RequestWithUser, res: any) => {
  const { entryId } = req.params
  const userId = req.user?.id

  const entry = await getEntry(entryId, userId)

  if (!entry) return res.status(404).send('Entry not found')

  const pdfStream = await createPdfResult(entry)

  res.setHeader('Content-Type', 'application/pdf')
  pdfStream.pipe(res)
  // eslint-disable-next-line no-console
  pdfStream.on('end', () => console.log('Done streaming, response sent.'))
})

export default entryRouter
