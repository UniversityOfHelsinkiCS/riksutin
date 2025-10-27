import type { FormValues, Risk } from '@types'
import type { UpdatedCountryData } from '@server/types'

import { totalCountryRisk } from './utils'

const getTotalRisk = (riskArray: Risk[], country: UpdatedCountryData | undefined, formData: FormValues) => {
  const { totalCountryRiskLevel } = totalCountryRisk(country)

  const roleMultiplier = formData[9] === 'coordinator' ? 1.2 : 1
  const durationMultiplier = formData[12] === 'longDuration' ? 1.2 : 1
  const agreementMultiplier = formData[10] === 'agreementNotDone' ? 1.2 : 1
  const previousCollaborationMultiplier = formData[24] === 'noSuccessfulCollaboration' ? 1.2 : 1

  // Compute only the overall economy risk to the overall risk
  const riskFiltered = riskArray.filter(value => !['economicScope', 'economicExchange'].includes(value.id))
  const allRisks: number[] = riskFiltered
    .map(value => value.level)
    .concat(totalCountryRiskLevel)
    .filter(value => value) as number[]

  let totalRiskLevel = Math.round(
    (allRisks.reduce((a, b) => a + b, 0) / allRisks.length) *
      roleMultiplier *
      durationMultiplier *
      agreementMultiplier *
      previousCollaborationMultiplier
  )

  if (allRisks.filter(value => value === 3).length >= 3 || totalRiskLevel > 3) {
    totalRiskLevel = 3
  }

  const totalRiskObject: Risk = {
    id: 'total',
    title: 'riskTable:totalRiskLevel',
    level: totalRiskLevel,
  }

  return totalRiskObject
}

export default getTotalRisk
