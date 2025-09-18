import logger from '../../logger'
import scheduleCronJob from '../schedule'
import { getCountryData } from '../../../routes/country'
import { set } from '../../redis'
import { getCountries } from '../../../services/countries'
import { totalCountryRisk } from '../../algorithm/utils'

const calculateTotalCountryRisk = async (countryCode: string) => {
  const countryData = await getCountryData(countryCode)

  const { totalCountryRiskLevel } = totalCountryRisk(countryData)
  if (!countryData) return null
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
