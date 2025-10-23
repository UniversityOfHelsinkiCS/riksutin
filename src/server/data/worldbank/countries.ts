import type { Info, FullCountry } from '@server/types'
import { fetchIndicatorData } from './util'

type Response = [Info, FullCountry[]]

const getCountries = async () => {
  const [_, data]: Response = await fetchIndicatorData('countries')

  const countries = data.filter(({ region }) => region.value !== 'Aggregates')

  return countries
}

export default getCountries
