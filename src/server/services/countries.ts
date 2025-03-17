import { FullCountry, Info } from '@server/types'
import { fetchData } from '../data/worldbank/util'

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
