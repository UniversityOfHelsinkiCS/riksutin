import logger from '../logger'
import scheduleCronJob from './schedule'
import { cacheSanctionsData } from 'src/server/data/sanctions/sanctionsMap'
import { cacheHdrData } from 'src/server/data/humanDevelopment'
import { buildIndividualCountryCaches } from 'src/server/data/per_country_cache'

export const buildCaches = async () => {
  logger.info('cache build started')
  logger.info('sanctionsmap cache')
  await cacheSanctionsData()
  logger.info('hdr cache')
  await cacheHdrData()
  logger.info('Per country caches')
  await buildIndividualCountryCaches()
  logger.info('caches built')
}

const startCountryRiskCron = () => {
  const cronTime = '15 18 * * 5'
  logger.info('Country risk data cron job scheduled')
  return scheduleCronJob(cronTime, buildCaches)
}

export default startCountryRiskCron
