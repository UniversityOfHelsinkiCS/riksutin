import logger from '../logger'
import scheduleCronJob from './schedule'
import { cacheUnits } from '../../services/faculty'
import { cacheCountryData } from '../../data/worldbank/util'
import { cacheSanctionsData } from '../../data/sanctions/sanctionsMap'
import { cacheHdrData } from '../../data/humanDevelopment'
import { buildIndividualCountryCaches } from '../../data/per_country_cache'
import { cacheHighRiskCountries } from './highRiskCountries/highRiskCountries'

const steps = {
  units: cacheUnits,
  countries: cacheCountryData,
  sanctions: cacheSanctionsData,
  hdr: cacheHdrData,
  perCountry: buildIndividualCountryCaches,
}

const refreshExternalDataCache = async () => {
  logger.info('cache refresh started')
  // one failing source should not keep the others from refreshing
  for (const [name, step] of Object.entries(steps)) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await step()
    } catch (error) {
      logger.error(`cache refresh failed: ${name}`, error)
    }
  }
  logger.info('cache refresh done')
}

const startCacheCron = () => {
  scheduleCronJob('15 18 * * 5', refreshExternalDataCache)
  // this is computed from the per-country data refreshed above
  scheduleCronJob('0 18 * * 1', cacheHighRiskCountries)
  logger.info('Cache cron jobs scheduled')
}

export default startCacheCron
