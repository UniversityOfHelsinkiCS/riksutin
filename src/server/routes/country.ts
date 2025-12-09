import express from 'express'

import type { CountryData } from '@types'

import { cacheHighRiskCountries } from '../util/cron/highRiskCountries/highRiskCountries'
import { get } from '../util/redis'
import getCountryIndicatorOld from '../data/worldbank/indicator'
import fetchSafetyLevelData from '../data/safetyLevel'
import getCountryUniversities from '../data/whed/countryUniversities'
import fetchSanctionsData, { cacheSanctionsData } from '../data/sanctions/sanctionsMap'
import parseRuleOfLaw from '../data/ruleOfLaw/parseRuleOfLaw'
import { getCountries } from '../services/countries'
import getHumanDevelopment from '../data/humanDevelopment'
import getAcademicFreedom from '../data/academicfreedom'
import { getWarnings } from '../services/warning'
import { buildPerCountryCache, cacheCountryData } from '../data/worldbank/util'
import adminHandler from '../middleware/admin'
import { getCountryIndicator } from '../data/worldbank_api'
import { buildIndividualCountryCaches } from '../data/per_country_cache'

export const getCountryData = async (code: string | undefined): Promise<CountryData | null> => {
  if (!code) {
    return null
  }

  const countries = await getCountries()
  const country = countries.find(country => country.iso2Code === code.toUpperCase())
  const name = country?.name
  const countryId = country?.id

  const corruptionNew = await getCountryIndicator(countryId, 'WB_WDI_CC_PER_RNK')
  const stabilityNew = await getCountryIndicator(countryId, 'WB_WDI_PV_PER_RNK')

  const corruption = await getCountryIndicatorOld(code, 'CC.PER.RNK')
  const stability = await getCountryIndicatorOld(code, 'PV.PER.RNK')
  // eslint-disable-next-line @typescript-eslint/await-thenable
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
    corruptionNew,
    stabilityNew,
    hci,
    safetyLevel,
    universities,
    sanctions,
    academicFreedom,
    ruleOfLaw,
    gdpr: null,
    countryRisk: null,
  }
}

const countryRouter = express.Router()

const warnedCountries = async () => {
  const warnings = await getWarnings()
  const coutries = await getCountries()

  return warnings
    .map(w => w.country)
    .map(id => coutries.find(c => c.iso2Code === id))
    .filter(Boolean)
}

const uniqConcat = (first, second) => {
  const result = [...first]
  for (const c of second) {
    if (!first.map(k => k.iso2Code).includes(c.iso2Code)) {
      result.push(c)
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}

countryRouter.get('/highrisk', async (req, res: any) => {
  const warned = await warnedCountries()

  const cached = await get<
    {
      name: string
      code: string
    }[]
  >('high_risk_countries')

  if (cached) {
    return res.status(200).send(uniqConcat(cached, warned))
  }

  const highRiskCountries = await cacheHighRiskCountries()

  return res.status(200).send(uniqConcat(highRiskCountries, warned))
})

countryRouter.get('/', async (_, res) => {
  const countries = await getCountries()

  return res.status(200).send(countries)
})

countryRouter.get('/:code', async (req, res) => {
  const country = await getCountryData(req.params.code)

  return res.status(200).send(country)
})

countryRouter.get('/:code/new', async (req, res) => {
  const code = req.params.code.toUpperCase()
  const countries = await getCountries()
  const country = countries.find(country => country.iso2Code === code)
  const countryId = country?.id

  const corruption = await getCountryIndicator(countryId, 'WB_WDI_CC_PER_RNK')
  const stability = await getCountryIndicator(countryId, 'WB_WDI_PV_PER_RNK')

  return res.status(200).send({ countryId, corruption, stability })
})

countryRouter.get('/cache/flush', adminHandler, async (req, res) => {
  await cacheSanctionsData()
  await cacheCountryData()
  await cacheHighRiskCountries()

  if (req.query.all === 'true') {
    await buildPerCountryCache()
  }

  return res.status(200).send({ status: 'OK' })
})

countryRouter.get('/cache/debug', adminHandler, async (req, res) => {
  const failed = await buildIndividualCountryCaches()
  return res.status(200).send({ failed })
})

countryRouter.get('/cache/highrisk', adminHandler, async (req, res) => {
  await cacheHighRiskCountries()

  return res.status(200).send({ status: 'OK' })
})

export default countryRouter
