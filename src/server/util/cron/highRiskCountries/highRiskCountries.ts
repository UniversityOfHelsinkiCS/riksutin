import logger from '../../logger'
import scheduleCronJob from '../schedule'
import { getCountryData } from '../../../routes/country'
import { set } from '../../redis'
import { getCountries } from '../../../services/countries'

// remove export
export const calculateTotalCountryRisk = async (countryCode: string) => {
  const countryData = await getCountryData(countryCode)
  if (!countryData) return null

  const { corruption, stability, hci, safetyLevel, academicFreedom, ruleOfLaw, sanctions, gdpr } = countryData

  const riskValues: number[] = [
    corruption,
    stability,
    hci,
    safetyLevel,
    academicFreedom,
    ruleOfLaw,
    sanctions,
    gdpr,
  ].filter(v => v && [1, 2, 3].includes(v)) as number[]

  // console.log('H calculateTotalRisk (highrisk calc)')
  // console.log({ corruption, stability, hci, safetyLevel, academicFreedom, ruleOfLaw, sanctions, gdpr })
  // console.log(riskValues)
  return riskValues && Math.round(riskValues.reduce((a, b) => a + b, 0) / riskValues.length)
}

export const getHighRiskCountries = async () => {
  logger.info('Calculating risk level 3 countries')
  const countries = await getCountries()
  const highRiskCountries: {
    name: string
    iso2Code: string
  }[] = []

  for (const country of countries) {
    const totalRisk = await calculateTotalCountryRisk(country.iso2Code)
    // eslint-disable-next-line no-console
    console.log(country.iso2Code, totalRisk)
    if (totalRisk === 3) {
      highRiskCountries.push(country)
    }
  }

  await set('high_risk_countries', highRiskCountries)
  return highRiskCountries
}

const startCountryCron = () => {
  const cronTime = '0 18 * * 1'
  logger.info('Cron job scheduled')
  return scheduleCronJob(cronTime, getHighRiskCountries)
}

export default startCountryCron
