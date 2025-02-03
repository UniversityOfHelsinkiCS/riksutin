import type { Info, FullCountry } from '@backend/types'
import { fetchData } from './util'

type Response = [Info, FullCountry[]]

const getCountries = async () => {
  const [info, data]: Response = await fetchData(`countries`)

  const countries = data.filter(({ region }) => region.value !== 'Aggregates')

  return countries
}

export default getCountries
