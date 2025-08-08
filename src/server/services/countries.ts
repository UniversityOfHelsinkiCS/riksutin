import { FullCountry, Info } from '@server/types'
import { fetchData, buildCache } from '../data/worldbank/util'
import { cacheSanctionsData } from '../data/sanctions/sanctionsMap'

type Response = [Info, FullCountry[]]

export const getCountries = async () => {
  const [_, data]: Response = await fetchData('countries')

  const filtered = data.filter(({ region }) => region.value !== 'Aggregates')

  const countries = filtered.map(({ name, iso2Code }) => ({
    name,
    iso2Code,
  }))

  return countries
}

export const cacheCountries = async () => {
  await buildCache()
  await cacheSanctionsData()
}
