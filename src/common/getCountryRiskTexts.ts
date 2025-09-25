import type { CountryData, FormValues, Locales, Result, Risk } from '@types'

const getCountryRisks = (
  country: CountryData | undefined,
  results: Result[],
  resultData: FormValues,
  language: string
) => {
  if (!country || !results || !resultData) {
    return null
  }

  const corruptionText = results.find(r => r.optionLabel === `corruption${country.corruption}`)?.isSelected[
    language as keyof Locales
  ]
  const safetyLevelText = results.find(r => r.optionLabel === `safetyLevel${country.safetyLevel}`)?.isSelected[
    language as keyof Locales
  ]
  const academicFreedomText = results.find(r => r.optionLabel === `academicFreedom${country.academicFreedom}`)
    ?.isSelected[language as keyof Locales]
  const politicalStabilityText = results.find(r => r.optionLabel === `politicalStability${country.stability}`)
    ?.isSelected[language as keyof Locales]
  const humanDevelopmentText = results.find(r => r.optionLabel === `HCI${country.hci}`)?.isSelected[
    language as keyof Locales
  ]
  const gdprText = results.find(r => r.optionLabel === `GDPR${country.gdpr}`)?.isSelected[language as keyof Locales]
  const sanctionsText = results.find(r => r.optionLabel === `sanctions${country.sanctions}`)?.isSelected[
    language as keyof Locales
  ]
  const ruleOfLawText = results.find(r => r.optionLabel === `ruleOfLaw${country.ruleOfLaw}`)?.isSelected[
    language as keyof Locales
  ]

  const countryRisks: Risk[] = [
    {
      id: 'corruption',
      title: 'riskTable:corruptionRank',
      level: country.corruption,
      infoText: corruptionText,
    },
    {
      id: 'safetyLevel',
      title: 'riskTable:safetyLevel',
      level: country.safetyLevel,
      infoText: safetyLevelText,
    },
    {
      id: 'academicFreedom',
      title: 'riskTable:academicFreedom',
      level: country.academicFreedom,
      infoText: academicFreedomText,
    },
    {
      id: 'politicalStability',
      title: 'riskTable:stabilityRank',
      level: country.stability,
      infoText: politicalStabilityText,
    },
    {
      id: 'HCI',
      title: 'riskTable:HCIrank',
      level: country.hci,
      infoText: humanDevelopmentText,
    },
    {
      id: 'GDPR',
      title: 'GDPR',
      level: country.gdpr ?? 0,
      infoText: gdprText,
    },
    {
      id: 'sanctions',
      title: 'riskTable:sanctions',
      level: country.sanctions,
      infoText: sanctionsText,
    },
    {
      id: 'ruleOfLaw',
      title: 'riskTable:ruleOfLaw',
      level: country.ruleOfLaw,
      infoText: ruleOfLawText,
    },
  ]

  return countryRisks
}

export default getCountryRisks
