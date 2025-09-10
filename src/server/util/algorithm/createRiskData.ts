import type { BaseCountry, FormValues, RiskData } from '@types'

import { getQuestions } from '../../services/question'
import { getCountryData } from '../../routes/country'
import getCountryRisks from './getCountryRisks'
import getOtherRisks from './getOtherRisks'
import getTotalRisk from './getTotalRisk'
import { getCountries } from '../../services/countries'
import { multilateralPartnerRisk } from './utils'

const getMultilateralRisks = async (mContries: string[], formData) => {
  const countries: BaseCountry[] = await getCountries()
  if (!mContries) {
    return []
  }

  const multilateralPartners = mContries
    ? mContries.map(c => countries.find(country => country.name === c)?.iso2Code)
    : []

  const multilateralCountryData = await Promise.all(
    multilateralPartners.map(async code => {
      const countryData = await getCountryData(code)

      // to keep compiler happy
      if (!countryData) {
        return null
      }

      const updatedCountryData = await getCountryRisks(countryData, formData)
      return updatedCountryData
    })
  )

  return multilateralCountryData.map(c => ({ ...c, universities: null, countryRisk: multilateralPartnerRisk(c) }))
}

const createRiskData = async (formData: FormValues) => {
  const countries: BaseCountry[] = await getCountries()
  const questions = await getQuestions('1')

  const selectedCountry: string = formData['8']
  const selectedCountryCode = countries.find(country => country.name === selectedCountry)?.iso2Code

  const countryData = await getCountryData(selectedCountryCode)

  if (!countryData) return null

  const multilateralCountries = await getMultilateralRisks(formData['26'], formData)

  const updatedCountryData = await getCountryRisks(countryData, formData)
  const otherRisks = getOtherRisks(updatedCountryData, questions, formData)
  const totalRisk = getTotalRisk(otherRisks, updatedCountryData, formData)

  const riskData: RiskData = {
    answers: formData,
    risks: otherRisks.concat(totalRisk),
    country: new Array(updatedCountryData),
    multilateralCountries,
  }

  return riskData
}

export default createRiskData
