import express from 'express'

import type { RequestWithUser } from '@server/types'
import adminHandler from '../middleware/admin'
import {
  createControlReportTemplate,
  deleteControlReportTemplate,
  getControlReportTemplateById,
  getControlReportTemplates,
  updateControlReportTemplate,
} from '../services/controlReportTemplate'

const controlReportTemplateRouter = express.Router()

controlReportTemplateRouter.get('/', async (req, res) => {
  const language = typeof req.query.language === 'string' ? req.query.language : undefined
  const results = await getControlReportTemplates(language)
  return res.send(results)
})

controlReportTemplateRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const result = await getControlReportTemplateById(String(id))
  return res.send(result)
})

controlReportTemplateRouter.post('/', adminHandler, async (req: RequestWithUser, res: any) => {
  try {
    const template = await createControlReportTemplate(req.body)
    return res.status(201).send(template)
  } catch (error: any) {
    return res.status(400).json({ error: 'routevirhe: ' + error.message })
  }
})

controlReportTemplateRouter.put('/:id', adminHandler, async (req: RequestWithUser, res: any) => {
  try {
    const { id } = req.params
    const updated = await updateControlReportTemplate(id, req.body)
    return res.send(updated)
  } catch (error: any) {
    return res.status(400).json({ error: 'routevirhe: ' + error.message })
  }
})

controlReportTemplateRouter.delete('/:id', adminHandler, async (req: RequestWithUser, res: any) => {
  const { id } = req.params
  await deleteControlReportTemplate(id)
  return res.status(204).send()
})

export default controlReportTemplateRouter
