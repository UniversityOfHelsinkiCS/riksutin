import type { BaseCountry, FormValues, RiskData } from '@types'

import { getQuestions } from '../../services/question'
import { getCountryData } from '../../routes/country'
import getCountryRisks, { getMultilateraCountrylRisks } from './countryRisks'
import getOtherRisks from './otherRisks'
import getTotalRisk from './totalRisk'
import { getCountries } from '../../services/countries'

const createRiskData = async (formData: FormValues) => {
  const countries: BaseCountry[] = await getCountries()
  const questions = await getQuestions('1')

  const multilateral = formData['4'] === 'multilateral'
  const hyCordinates = formData['9'] === 'coordinator'

  let selectedCountry: string = formData['8']

  const multilateralCountries = await getMultilateraCountrylRisks(formData['26'], formData['28'], formData)
  // if HY cordinates, we do the calculation based on highest risk partner
  if (multilateral && hyCordinates && multilateralCountries.length > 0) {
    multilateralCountries.sort(
      (a, b) => (b?.countryRisk?.rawTotalCountryRiskLevel ?? 0) - (a?.countryRisk?.rawTotalCountryRiskLevel ?? 0)
    )
    selectedCountry = multilateralCountries[0].name!
  }

  const selectedCountryCode = countries.find(country => country.name === selectedCountry)?.iso2Code

  const countryData = await getCountryData(selectedCountryCode)

  if (!countryData) return null

  const updatedCountryData = await getCountryRisks(countryData, formData)
  const otherRisks = getOtherRisks(updatedCountryData, questions, formData)
  const totalRisk = getTotalRisk(otherRisks, updatedCountryData, formData)

  const riskData: RiskData = {
    answers: formData,
    risks: otherRisks.concat(totalRisk),
    country: new Array(updatedCountryData),
    multilateralCountries: multilateralCountries as any,
  }

  return riskData
}

export default createRiskData
