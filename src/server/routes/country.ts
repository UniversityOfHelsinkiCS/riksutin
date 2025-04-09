import express from 'express'

import type { CountryData } from '@types'

import { getHighRiskCountries } from '../util/cron/highRiskCountries/highRiskCountries'
import { get } from '../util/redis'
import getCountryIndicator from '../data/worldbank/indicator'
import fetchSafetyLevelData from '../data/safetyLevel'
import getCountryUniversities from '../data/whed/countryUniversities'
import fetchSanctionsData from '../data/sanctions/sanctionsMap'
import parseAcademicFreedom from '../data/academicfreedom/parseAcademicFreedom'
import parseRuleOfLaw from '../data/ruleOfLaw/parseRuleOfLaw'
import parseHumanDevelopment from '../data/humanDevelopment/parseHumanDevelopment'
import { getCountries } from '../services/countries'

export const getCountryData = async (code: string | undefined): Promise<CountryData | null> => {
  if (!code) return null
  const countries = await getCountries()

  const countryName = countries.find(country => country.iso2Code === code.toUpperCase())?.name

  const corruption = await getCountryIndicator(code, 'CC.PER.RNK')
  const stability = await getCountryIndicator(code, 'PV.PER.RNK')
  const hci = parseHumanDevelopment(countryName)
  const safetyLevel = await fetchSafetyLevelData(code)
  const universities = await getCountryUniversities(countryName)
  const sanctions = await fetchSanctionsData(code)
  const academicfreedom = parseAcademicFreedom(code)
  const ruleOfLaw = parseRuleOfLaw(countryName)

  const country: CountryData = {
    code,
    corruption,
    stability,
    hci,
    safetyLevel,
    universities,
    sanctions,
    academicfreedom,
    ruleOfLaw,
    gdpr: null,
  }

  return country
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

countryRouter.get('/:code', async (req, res) => {
  const country = await getCountryData(req.params.code)

  return res.status(200).send(country)
})

export default countryRouter
