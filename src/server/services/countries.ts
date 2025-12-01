import { getCountryData } from '../data/worldbank/util'

export const getCountries = async () => {
  const countries = await getCountryData()
  return countries
}
