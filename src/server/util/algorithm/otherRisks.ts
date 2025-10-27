import type { FormValues, Question, Risk } from '@types'
import type { UpdatedCountryData } from '@server/types'

import { totalCountryRisk, dualUseRisk, organisationRisk, universityRisk, consortiumRisk } from './utils'

const getOtherRisks = (country: UpdatedCountryData, questions: Question[], formData: FormValues) => {
  const { totalCountryRiskLevel } = totalCountryRisk(country)
  const dualUseRiskValue = dualUseRisk(questions, formData, country)
  const organisationRiskValue = organisationRisk(formData)
  const economicCurrencyRisk =
    questions.find(question => question.id === 31)?.optionData.options.find(o => o.id === formData[31])?.risk ?? 1
  const economicScopeRisk =
    questions.find(question => question.id === 16)?.optionData.options.find(o => o.id === formData[16])?.risk ?? 1
  const economicAdditionalRisk =
    (formData[14] && formData[14] === 'notPreviouslyFunded') ||
    (formData[15] && (formData[15] === 'internationalCompany' || formData[15] === 'finnishCompany'))
      ? 1
      : 0

  const totalEconomicalRisk = Math.round((economicCurrencyRisk + economicScopeRisk) / 2) + economicAdditionalRisk
  const ethicalRiskValue = questions
    .find(question => question.id === 25)
    ?.optionData.options.find((o: { id: any }) => o.id === formData[25])?.risk

  const riskArray: Risk[] = [
    {
      id: 'country',
      title: 'riskTable:countryRiskLevel',
      level: totalCountryRiskLevel,
    },
    {
      id: 'university',
      title: 'riskTable:universityRiskLevel',
      level: universityRisk(formData['20'], country?.universities),
    },
    {
      id: 'duration',
      title: 'riskTable:durationRiskLevel',
      level: questions.find(question => question.id === 12)?.optionData.options.find(o => o.id === formData[12])?.risk,
    },
    {
      id: 'dualUse',
      title: 'riskTable:dualUseRiskLevel',
      level: dualUseRiskValue,
    },
    {
      id: 'organisation',
      title: 'riskTable:organisationRiskLevel',
      level: organisationRiskValue,
    },
    {
      id: economicAdditionalRisk > 0 ? 'economicAdditional' : 'economic',
      title: 'riskTable:economicRiskLevel',
      level: totalEconomicalRisk < 4 ? totalEconomicalRisk : 3,
    },
    {
      id: 'economicScope',
      title: 'riskTable:economicScopeRiskLevel',
      level: economicScopeRisk,
    },
    {
      id: 'economicExchange',
      title: 'riskTable:economicExchangeRiskLevel',
      level: economicCurrencyRisk,
    },
    {
      id: 'ethical',
      title: 'riskTable:ethicalRiskLevel',
      level: ethicalRiskValue,
    },
  ]

  if (formData[26]) {
    const consortium: Risk = {
      id: 'consortium',
      title: 'riskTable:consortiumRiskLevel',
      level: consortiumRisk(formData[26]),
    }
    riskArray.push(consortium)
  }

  const filteredArray = riskArray.filter(value => value.level !== null && value.level !== undefined)

  return filteredArray
}

export default getOtherRisks
