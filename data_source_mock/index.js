/* eslint-disable no-console */
import express from 'express'
import fs from 'fs/promises'

const app = express()
const PORT = process.env.PORT || 3000
const BROKEN_SANCTIONS = process.env.BROKEN_SANCTIONS || false

let sentMail = []

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
  res.send(
    'I am the Riksutin data source mock, if you are looking for riksutin, go to <a href="http://localhost:8000">http://localhost:8000</a>'
  )
})

app.get('/sanctions', async (req, res) => {
  if (BROKEN_SANCTIONS) {
    console.log('MOCK sanctions, broken', BROKEN_SANCTIONS)
    return res.status(Number(BROKEN_SANCTIONS)).send({ message: 'errored' })
  }

  const data = await fs.readFile('./data/sanctions.json', 'utf-8')
  console.log('MOCK sanctions')
  return res.json(JSON.parse(data))
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

app.post('/pate/upload', async (req, res) => {
  console.log('MOCK pate upload')
  res.json({ message: 'success' })
})

app.post('/pate', async (req, res) => {
  const { body } = req
  console.log('MOCK pate', body)
  sentMail.push(body)
  res.json({ message: 'success' })
})

app.get('/pate', async (req, res) => {
  res.json(sentMail)
})

app.get('/pate/reset', async (req, res) => {
  sentMail = []
  res.json([])
})

app.get('/hdr', async (req, res) => {
  const data = await fs.readFile('./data/hdr.json', 'utf-8')
  console.log('MOCK hdr')
  res.json(JSON.parse(data))
})

app.get('/country/:countryCode/indicator/:indicatorCode', async (req, res) => {
  // source     https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?per_page=1000&format=json
  // indicators CC.PER.RNK PV.PER.RNK
  const { countryCode, indicatorCode } = req.params

  const valid = ['ZM', 'AF', 'CN', 'BY', 'SE', 'DK']

  /*
    ZM: Sambia
    AF: Afganistan
    CN: Kiina
    BY: Valko-Venäjä (Belarus)
    SE: Ruotsi
    DK: Tanska
  */

  const code = valid.includes(countryCode) ? countryCode : 'ZM'
  const ind = indicatorCode.slice(0, 2)
  const data = await fs.readFile(`./data/indicators/${code}_${ind}.json`, 'utf-8')

  console.log('MOCK', code, indicatorCode, '(' + countryCode + ')')

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
  console.log('BROKEN_SANCTIONS', BROKEN_SANCTIONS)
})
