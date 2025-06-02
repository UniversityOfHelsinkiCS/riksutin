import express from 'express'

import { getWarnings } from '../services/warning'

const warningsRouter = express.Router()

warningsRouter.get('/', async (_req, res) => {
  //const { warning } = req.params
  const results = await getWarnings()
  return res.send(results)
})

export default warningsRouter
