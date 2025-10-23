import { fetchData, buildCache } from '../data/worldbank/util'

export const getCountries = async () => {
  const countries = await fetchData('countries')
  return countries
}

export const cacheCountries = async () => {
  await buildCache()
}
