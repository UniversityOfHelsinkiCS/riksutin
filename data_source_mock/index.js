/* eslint-disable no-console */
import express from 'express'
import fs from 'fs/promises'

const app = express()
const PORT = process.env.PORT || 3000
const BROKEN_SANCTIONS = process.env.BROKEN_SANCTIONS || false
const BROKEN_COUNTRIES = process.env.BROKEN_COUNTRIES || false
const BROKEN_INDICATORS = process.env.BROKEN_INDICATORS || false
const BROKEN_UNIVERSITIES = process.env.BROKEN_UNIVERSITIES || false
const BROKEN_UM = process.env.BROKEN_UM | false

let sentMail = []

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
  res.send(
    'I am the Riksutin data source mock, if you are looking for riksutin, go to <a href="http://localhost:8000">http://localhost:8000</a>'
  )
})

app.get('/sanctions', async (req, res) => {
  if (BROKEN_SANCTIONS && !req.query.ok) {
    console.log('MOCK sanctions, broken', BROKEN_SANCTIONS)
    return res.status(Number(BROKEN_SANCTIONS)).send({ message: 'errored' })
  }

  const data = await fs.readFile('./data/sanctions.json', 'utf-8')
  console.log('MOCK sanctions')
  return res.json(JSON.parse(data))
})

app.get('/countries', async (req, res) => {
  if (BROKEN_COUNTRIES && !req.query.ok) {
    console.log('MOCK countries, broken', BROKEN_COUNTRIES)
    return res.status(Number(BROKEN_COUNTRIES)).send({ message: 'errored' })
  }

  const data = await fs.readFile('./data/worldbank_countries.json', 'utf-8')
  console.log('MOCK countries')
  return res.json(JSON.parse(data))
})

app.post('/universities', async (req, res) => {
  if (BROKEN_UNIVERSITIES && !req.query.ok) {
    console.log('MOCK universities, broken', BROKEN_UNIVERSITIES)
    return res.status(Number(BROKEN_UNIVERSITIES)).send({ message: 'errored' })
  }

  const { country } = req.query
  const html = await fs.readFile('./data/univ.html', 'utf-8')
  res.set('Content-Type', 'text/html; charset=UTF-8')
  console.log('MOCK universities', country)
  return res.send(html)
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

// eslint-disable-next-line consistent-return
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

  if (BROKEN_INDICATORS && !req.query.ok) {
    console.log('MOCK country indicators, broken', BROKEN_INDICATORS)
    return res.status(Number(BROKEN_INDICATORS)).send({ message: 'errored' })
  }

  res.json(JSON.parse(data))
})

app.get('/um/o/rss', async (req, res) => {
  console.log('MOCK UM')
  if (BROKEN_UM && !req.query.ok) {
    console.log('MOCK UM, broken', BROKEN_UM)
    return res.status(Number(BROKEN_UM)).send({ message: 'errored' })
  }

  const xml = await fs.readFile('./data/travelinfo.xml', 'utf-8')
  res.set('Content-Type', 'application/rss+xml;charset=UTF-8')
  return res.send(xml)
})

app.listen(PORT, () => {
  console.log('MOCK started in port', PORT)
  console.log('BROKEN_SANCTIONS', BROKEN_SANCTIONS)
  console.log('BROKEN_COUNTRIES', BROKEN_COUNTRIES)
  console.log('BROKEN_UNIVERSITIES', BROKEN_UNIVERSITIES)
  console.log('BROKEN_INDICATORS', BROKEN_INDICATORS)
  console.log('BROKEN_UM', BROKEN_UM)
})
