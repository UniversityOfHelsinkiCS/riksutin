import logger from '../../logger'
import scheduleCronJob from '../schedule'
import { getCountryData } from '../../../routes/country'
import { set } from '../../redis'
import { getCountries } from '../../../services/countries'

const calculateTotalRisk = async (countryCode: string) => {
  const countryData = await getCountryData(countryCode)
  if (!countryData) return null
  const { code, createdAt, gdpr, universities, sanctions, ...numberRisks } = countryData

  const riskValues = Object.values(numberRisks)

  const sanctionsRiskLevel = countryData.sanctions ? 2 : 1

  const totalCountryRiskLevel =
    Math.round(riskValues.concat(sanctionsRiskLevel).reduce((a, b) => a + b, 0) / riskValues.length) || 0

  return totalCountryRiskLevel
}

export const getHighRiskCountries = async () => {
  logger.info('Calculating risk level 3 countries')
  const countries = await getCountries()
  const highRiskCountries: {
    name: string
    iso2Code: string
  }[] = []

  for (const country of countries) {
    const totalRisk = await calculateTotalRisk(country.iso2Code)
    if (totalRisk === 3) {
      highRiskCountries.push(country)
    }
  }

  await set('high risk countries', highRiskCountries)
  return highRiskCountries
}

const startCountryCron = () => {
  const cronTime = '0 18 * * 1'
  logger.info('Cron job scheduled')
  return scheduleCronJob(cronTime, getHighRiskCountries)
}

export default startCountryCron
