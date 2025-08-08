import logger from '../logger'
import scheduleCronJob from './schedule'
import { buildCache as buildWorldbankCache } from '../../data/worldbank/util'
import { cacheSanctionsData } from 'src/server/data/sanctions/sanctionsMap'

export const getHighRiskCountries = async () => {
  logger.info('Worldbank cache')
  await buildWorldbankCache()
  logger.info('sanctionsmap cache')
  await cacheSanctionsData()
  logger.info('caches built')
}

const startCountryRiskCron = () => {
  const cronTime = '15 15 * * 5'
  logger.info('Country risk data cron job scheduled')
  return scheduleCronJob(cronTime, getHighRiskCountries)
}

export default startCountryRiskCron
