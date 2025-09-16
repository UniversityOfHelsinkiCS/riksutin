import logger from '../../logger'
import scheduleCronJob from '../schedule'
import { getCountryData } from '../../../routes/country'
import { set } from '../../redis'
import { getCountries } from '../../../services/countries'

const calculateTotalRisk = async (countryCode: string) => {
  const countryData = await getCountryData(countryCode)
  if (!countryData) return null
  const { name, code, createdAt, gdpr, universities, sanctions, ...numberRisks } = countryData

  const sanctionsRiskLevel: number = countryData.sanctions ? 2 : 1

  const riskValues = Object.values(numberRisks)
    .concat(sanctionsRiskLevel)
    .map(v => ([1, 2, 3].includes(v) ? v : 1))
  // out of range values (such as null) default to 1

  return Math.round(riskValues.reduce((a, b) => a + b, 0) / riskValues.length) || 0
}

export const getHighRiskCountries = async () => {
  logger.info('Calculating risk level 3 countries')
  const countries = (await getCountries()).slice(0, 1)
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
