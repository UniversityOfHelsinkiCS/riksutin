/* eslint-disable no-console */
import express from 'express'
import fs from 'fs/promises'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/sanctions', async (req, res) => {
  const data = await fs.readFile('./data/sanctions.json', 'utf-8')
  console.log('MOCK sanctions')
  res.json(JSON.parse(data))
})

app.get('/countries', async (req, res) => {
  const data = await fs.readFile('./data/worldbank_countries.json', 'utf-8')
  console.log('MOCK countries')
  res.json(JSON.parse(data))
})

app.post('/universities', async (req, res) => {
  const { country } = req.query
  const html = await fs.readFile('./data/univ.html', 'utf-8')
  res.set('Content-Type', 'text/html; charset=UTF-8')
  console.log('MOCK universities', country)
  res.send(html)
})

app.get('/hdr', async (req, res) => {
  const data = await fs.readFile('./data/hdr.json', 'utf-8')
  console.log('MOCK hdr')
  res.json(JSON.parse(data))
})

app.get('/country/:countryCode/indicator/:indicatorCode', async (req, res) => {
  const { countryCode, indicatorCode } = req.params

  console.log('MOCK', countryCode, indicatorCode)

  const code = 'ZN'
  const ind = indicatorCode.slice(0, 2)
  const data = await fs.readFile(`./data/${code}_${ind}.json`, 'utf-8')

  res.json(JSON.parse(data))
})

app.get('/um/o/rss', async (req, res) => {
  console.log('MOCK UM')
  const xml = await fs.readFile('./data/travelinfo.xml', 'utf-8')
  res.set('Content-Type', 'application/rss+xml;charset=UTF-8')
  res.send(xml)
})

app.listen(PORT, () => {
  console.log('MOCK started in port', PORT)
})
