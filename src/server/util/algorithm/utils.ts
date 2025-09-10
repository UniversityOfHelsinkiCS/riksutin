import type { CountryData, FormValues, Question } from '@types'
import type { UpdatedCountryData } from '@server/types'

import { euCountries, eeaCountries, adequateProtectionCountries } from '@common/countryLists'

export const gdprRisk = (country: CountryData | undefined, resultData: FormValues) => {
  if (resultData['17'] === 'noTransferPersonalData') return 1
  if (!country) return null
  if (resultData['17'] === 'transferPersonalData' && eeaCountries.includes(country.code)) return 1
  if (
    resultData['17'] === 'transferPersonalData' &&
    !eeaCountries.includes(country.code) &&
    adequateProtectionCountries.includes(country.code)
  )
    return 2
  if (
    resultData['17'] === 'transferPersonalData' &&
    !eeaCountries.includes(country.code) &&
    !adequateProtectionCountries.includes(country.code)
  )
    return 3
  return null
}

export const multilateralPartnerRisk = (updatedCountryData: any) => {
  if (!updatedCountryData) return null

  const { name, code, createdAt, universities, gdpr, ...numberRisks } = updatedCountryData

  const countryRisksFiltered: number[] = gdpr ? Object.values(numberRisks).concat(gdpr) : Object.values(numberRisks)

  if (!countryRisksFiltered || countryRisksFiltered.length === 0) return null

  const totalCountryRiskLevel = countryRisksFiltered.reduce((a, b) => a + b, 0) / countryRisksFiltered.length || 0

  return {
    rawTotalCountryRiskLevel: totalCountryRiskLevel,
    totalCountryRiskLevel: Math.round(totalCountryRiskLevel),
    countryRisksFiltered,
  }
}

export const totalCountryRisk = (updatedCountryData: UpdatedCountryData | undefined, formData: FormValues) => {
  if (!updatedCountryData || !formData) return null

  const { name, code, createdAt, universities, gdpr, ...numberRisks } = updatedCountryData

  const countryRisksFiltered: number[] = gdpr ? Object.values(numberRisks).concat(gdpr) : Object.values(numberRisks)

  if (!countryRisksFiltered || countryRisksFiltered.length === 0) return null

  const totalCountryRiskLevel =
    Math.round(countryRisksFiltered.reduce((a, b) => a + b, 0) / countryRisksFiltered.length) || 0

  return [totalCountryRiskLevel, countryRisksFiltered]
}

export const universityRisk = (university: string | undefined, countryUniversities: string[] | undefined) => {
  if (!university) return null

  if (countryUniversities?.includes(university)) {
    return 1
  }

  return 3
}

export const dualUseRisk = (questions: Question[], resultData: FormValues, country: CountryData | undefined) => {
  if (!country) return null
  if (euCountries.includes(country.code)) return 1
  return questions.find(question => question.id === 23)?.optionData.options.find(o => o.id === resultData[23])?.risk
}

export const organisationRisk = (resultData: FormValues) => {
  if (!resultData[22] && !resultData.selectOrganisation) return null
  if (resultData.selectOrganisation) return 1
  if (!resultData.selectOrganisation && resultData[24] === 'succefultCollaboration') return 2
  if (!resultData.selectOrganisation && resultData[24] === 'noSuccessfulCollaboration') return 3
  return null
}

export const consortiumRisk = (selectedCountries: string[] | undefined) => {
  if (!selectedCountries) return 1
  if (selectedCountries?.length === 0) {
    return 1
  }
  if (selectedCountries.length >= 2) {
    return 3
  }
  return 2
}
