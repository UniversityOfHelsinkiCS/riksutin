import logger from '../logger'
import scheduleCronJob from './schedule'
import { buildPerCountryCache } from '../../data/worldbank/util'
import { cacheSanctionsData } from 'src/server/data/sanctions/sanctionsMap'
import { cacheHdrData } from 'src/server/data/humanDevelopment'

export const buildCaches = async () => {
  logger.info('cache build started')
  logger.info('sanctionsmap cache')
  await cacheSanctionsData()
  logger.info('hdr cache')
  await cacheHdrData()
  logger.info('Per country cache')
  await buildPerCountryCache()
  logger.info('caches built')
}

const startCountryRiskCron = () => {
  const cronTime = '15 15 * * 5'
  logger.info('Country risk data cron job scheduled')
  return scheduleCronJob(cronTime, buildCaches)
}

export default startCountryRiskCron
