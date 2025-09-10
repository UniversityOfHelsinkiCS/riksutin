import type { CountryData, FormValues } from '@types'
import type { UpdatedCountryData } from '@server/types'

import { gdprRisk } from './utils'
import { getCountries } from 'src/server/services/countries'

const getCountryRisks = async (countryData: CountryData, formData: FormValues) => {
  const countries = await getCountries()
  const country = countries.find(country => country.iso2Code === countryData.code.toUpperCase())

  const sanctionsRiskLevel = countryData.sanctions ? 3 : 1
  const gdprRiskLevel = gdprRisk(countryData, formData)
  const sanctionsMultiplier = sanctionsRiskLevel === 3 && formData['11'].research ? 1.5 : 1

  const safetyLevelMultiplier =
    (countryData.safetyLevel === 2 || countryData.safetyLevel === 3) &&
    (formData['11'].studentMobility || formData['11'].staffMobility)
      ? 1.5
      : 1

  const updatedCountryData: UpdatedCountryData = {
    ...countryData,
    name: country?.name,
    sanctions: sanctionsRiskLevel * sanctionsMultiplier,
    safetyLevel: safetyLevelMultiplier * countryData.safetyLevel,
    gdpr: gdprRiskLevel,
  }

  return updatedCountryData
}

export default getCountryRisks
