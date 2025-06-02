import express from 'express'

import { getWarnings } from '../services/warning'

const warningRouter = express.Router()

warningRouter.get('/', async (_req, res) => {
  //const { warning } = req.params
  const results = await getWarnings()
  return res.send(results)
})

export default warningRouter
