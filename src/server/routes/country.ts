import express from 'express'

import type { CountryData } from '@types'

import { getHighRiskCountries } from '../util/cron/highRiskCountries/highRiskCountries'
import { get } from '../util/redis'
import getCountryIndicator from '../data/worldbank/indicator'
import fetchSafetyLevelData from '../data/safetyLevel'
import getCountryUniversities from '../data/whed/countryUniversities'
import fetchSanctionsData, { cacheSanctionsData } from '../data/sanctions/sanctionsMap'
import parseRuleOfLaw from '../data/ruleOfLaw/parseRuleOfLaw'
import { getCountries, cacheCountries } from '../services/countries'
import getHumanDevelopment, { cacheHdrData } from '../data/humanDevelopment'
import getAcademicFreedom from '../data/academicfreedom'

export const getCountryData = async (code: string | undefined): Promise<CountryData | null> => {
  if (!code) return null

  const countries = await getCountries()
  const country = countries.find(country => country.iso2Code === code.toUpperCase())
  const name = country?.name
  const countryId = country?.id

  const corruption = await getCountryIndicator(code, 'CC.PER.RNK')
  const stability = await getCountryIndicator(code, 'PV.PER.RNK')
  const hci = await getHumanDevelopment(name, countryId)
  const safetyLevel = await fetchSafetyLevelData(code)
  const universities = await getCountryUniversities(name)
  const sanctions = await fetchSanctionsData(code)
  const ruleOfLaw = parseRuleOfLaw(name)
  const academicFreedom = getAcademicFreedom(countryId)

  return {
    name,
    code,
    corruption,
    stability,
    hci,
    safetyLevel,
    universities,
    sanctions,
    academicFreedom,
    ruleOfLaw,
    gdpr: null,
  }
}

const countryRouter = express.Router()

countryRouter.get('/highrisk', async (req, res: any) => {
  const cached = await get<
    {
      name: string
      code: string
    }[]
  >('high risk countries')

  if (cached) return res.status(200).send(cached)

  const highRiskCountries = await getHighRiskCountries()

  return res.status(200).send(highRiskCountries)
})

countryRouter.get('/', async (_, res) => {
  const countries = await getCountries()

  return res.status(200).send(countries)
})

countryRouter.get('/cache', async (req, res) => {
  if (req.query.all === 'true') {
    await cacheCountries()
  }
  await cacheSanctionsData()
  await cacheHdrData()
  await getHighRiskCountries()

  return res.status(200).send({ status: 'OK' })
})

countryRouter.get('/cache/highrisk', async (req, res) => {
  await getHighRiskCountries()

  return res.status(200).send({ status: 'OK' })
})

countryRouter.get('/:code', async (req, res) => {
  const country = await getCountryData(req.params.code)

  return res.status(200).send(country)
})

export default countryRouter
