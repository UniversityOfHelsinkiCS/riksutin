import type { FormValues, Risk } from '@types'
import type { UpdatedCountryData } from '@server/types'

import { totalCountryRisk } from './utils'

const getTotalRisk = (riskArray: Risk[], country: UpdatedCountryData | undefined, formData: FormValues) => {
  const countryRiskValues = totalCountryRisk(country, formData)

  const roleMultiplier = formData[9] === 'coordinator' ? 1.2 : 1
  const durationMultiplier = formData[12] === 'longDuration' ? 1.2 : 1
  const agreementMultiplier = formData[10] === 'agreementNotDone' ? 1.2 : 1
  const previousCollaborationMultiplier = formData[24] === 'noSuccessfulCollaboration' ? 1.2 : 1

  const allRisks = riskArray
    .map(value => value.level)
    .concat(countryRiskValues ? countryRiskValues[1] : [])
    .filter(value => value)

  let totalRiskLevel = Math.round(
    (allRisks.reduce((a, b) => a + b, 0) / allRisks.length) *
      roleMultiplier *
      durationMultiplier *
      agreementMultiplier *
      previousCollaborationMultiplier
  )

  if (allRisks.filter(value => value === 3).length >= 3) totalRiskLevel = 3

  const totalRiskObject: Risk = {
    id: 'total',
    title: 'riskTable:totalRiskLevel',
    level: totalRiskLevel,
  }

  return totalRiskObject
}

export default getTotalRisk
