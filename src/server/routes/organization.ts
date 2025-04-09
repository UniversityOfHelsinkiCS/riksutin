import express from 'express'

const organizationRouter = express.Router()

organizationRouter.get('/:org', async (req, res) => {
  const { org } = req.params

  const params = '&pageSize=20&pageNumber=1'
  const url = `https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA_PERSON&text="${org}"${params}`

  const response = await fetch(url, { method: 'POST' })
  const data = await response.json()

  const resultNames = [...new Set(data.results.map(result => result.summary))]

  return res.status(200).send(resultNames)
})

export default organizationRouter
