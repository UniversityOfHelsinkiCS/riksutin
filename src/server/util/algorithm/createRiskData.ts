import type { BaseCountry, FormValues, RiskData } from '@types'

import { getQuestions } from '../../services/question'
import { getCountries, getCountryData } from '../../routes/country'
import getCountryRisks from './getCountryRisks'
import getOtherRisks from './getOtherRisks'
import getTotalRisk from './getTotalRisk'

const createRiskData = async (formData: FormValues) => {
  const countries: BaseCountry[] = await getCountries()
  const questions = await getQuestions('1')

  const selectedCountry: string = formData['8']
  const selectedCountryCode = countries?.find(
    (country) => country.name === selectedCountry
  )?.iso2Code

  const countryData = await getCountryData(selectedCountryCode)

  if (!countryData) return null

  const updatedCountryData = getCountryRisks(countryData, formData)
  const otherRisks = getOtherRisks(updatedCountryData, questions, formData)
  const totalRisk = getTotalRisk(otherRisks, updatedCountryData, formData)

  const riskData: RiskData = {
    answers: formData,
    risks: otherRisks.concat(totalRisk),
    country: new Array(updatedCountryData),
  }

  return riskData
}

export default createRiskData
