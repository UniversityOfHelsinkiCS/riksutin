import type { CountryData, FormValues, Question } from '@types'
import type { UpdatedCountryData } from '@server/types'

import { eeaCountries, adequateProtectionCountries } from '@common/countryLists'

export const gdprRisk = (country: CountryData | undefined, resultData: FormValues) => {
  if (resultData['17'] === 'noTransferPersonalData') {
    return 1
  }
  if (!country) {
    return null
  }
  if (resultData['17'] === 'transferPersonalData' && eeaCountries.includes(country.code)) {
    return 1
  }
  if (
    resultData['17'] === 'transferPersonalData' &&
    !eeaCountries.includes(country.code) &&
    adequateProtectionCountries.includes(country.code)
  ) {
    return 2
  }
  if (
    resultData['17'] === 'transferPersonalData' &&
    !eeaCountries.includes(country.code) &&
    !adequateProtectionCountries.includes(country.code)
  ) {
    return 3
  }
  return null
}

export const totalCountryRisk = (updatedCountryData: UpdatedCountryData | null) => {
  if (!updatedCountryData) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw 'totalCountryRisk'
  }

  const { corruption, stability, hci, safetyLevel, academicFreedom, ruleOfLaw, sanctions, gdpr } = updatedCountryData

  const riskValues: number[] = [
    corruption,
    stability,
    hci,
    safetyLevel,
    academicFreedom,
    ruleOfLaw,
    sanctions,
    gdpr,
  ].filter(v => v && [1, 2, 3].includes(v)) as number[]

  const rawTotalCountryRiskLevel = riskValues && riskValues.reduce((a, b) => a + b, 0) / riskValues.length

  return {
    rawTotalCountryRiskLevel,
    totalCountryRiskLevel: Math.round(rawTotalCountryRiskLevel),
    riskValues,
  }
}

export const universityRisk = (university: string | undefined, countryUniversities: string[] | undefined | null) => {
  if (!university) {
    return null
  }

  if (countryUniversities?.includes(university)) {
    return 1
  }

  return 3
}

export const dualUseRisk = (questions: Question[], resultData: FormValues, country: CountryData | undefined) => {
  if (!country) {
    return null
  }
  return questions.find(question => question.id === 23)?.optionData.options.find(o => o.id === resultData[23])?.risk
}

export const organisationRisk = (resultData: FormValues) => {
  if (!resultData[22] && !resultData.selectOrganisation) {
    return null
  }
  if (resultData.selectOrganisation) {
    return 1
  }
  if (!resultData.selectOrganisation && resultData[24] === 'succefultCollaboration') {
    return 2
  }
  if (!resultData.selectOrganisation && resultData[24] === 'noSuccessfulCollaboration') {
    return 3
  }
  return null
}

export const consortiumRisk = (selectedCountries: string[] | undefined) => {
  if (!selectedCountries) {
    return 1
  }
  if (selectedCountries?.length === 0) {
    return 1
  }
  if (selectedCountries.length >= 2) {
    return 3
  }
  return 2
}
