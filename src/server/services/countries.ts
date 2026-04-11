import { getCountryData } from '../data/worldbank/util'

const EXTRA_COUNTRIES = [{ id: 'TWN', name: 'Taiwan', iso2Code: 'TW' }]

export const getCountries = async () => {
  const countries = await getCountryData()
  const extraToAdd = EXTRA_COUNTRIES.filter(e => !countries.some(c => c.iso2Code === e.iso2Code))
  return [...countries, ...extraToAdd]
}
