import logger from '../logger'
import scheduleCronJob from './schedule'
import { buildCache as buildWorldbankCache } from '../../data/worldbank/util'

export const getHighRiskCountries = async () => {
  logger.info('Worldbank cache')
  await buildWorldbankCache()
  logger.info('cache built')
}

const startCountryRiskCron = () => {
  const cronTime = '* * * * *'
  logger.info('Country risk data cron job scheduled')
  return scheduleCronJob(cronTime, getHighRiskCountries)
}

export default startCountryRiskCron
