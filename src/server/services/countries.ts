import { getCountryData, buildCache } from '../data/worldbank/util'

export const getCountries = async () => {
  const countries = await getCountryData()
  return countries
}

export const cacheCountries = async () => {
  await buildCache()
}
