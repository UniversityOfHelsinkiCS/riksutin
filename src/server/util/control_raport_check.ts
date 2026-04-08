import { ENTRY_STATES } from '@common/entryStates'
import { getRiskParts } from '@common/getRiskParts'

import type { RiskData } from '@types'

const HIGH_RISK_COUNTRY_CODES = ['IL', 'RU', 'BY']

export const controlRaportCheck = (data: RiskData): { state: string | undefined; parts: string[] } => {
  const totalRisk = (data as any)?.risks?.find((r: any) => r.id === 'total')?.level
  const total = totalRisk > 2

  const economicRisk = (data as any)?.risks?.find((r: any) => r.id === 'economic')?.level
  const highEconomicRisk = economicRisk === 3

  const nonEuroCurrency = data.answers['31'] === 'otherCurrency' || data.answers['31'] === 'partlyEuros'

  const dualUseRisk = (data as any)?.risks?.find((r: any) => r.id?.includes('dualUse'))?.level
  const highDualUseRisk = dualUseRisk === 3

  const highGdprRisk = data.country?.some(c => c.gdpr === 3) ?? false

  const allCountries = [...(data.country ?? []), ...(data.multilateralCountries ?? [])]
  const highRiskCountry = allCountries.some(c => HIGH_RISK_COUNTRY_CODES.includes(c.code))

  const shouldBePending =
    total || highEconomicRisk || nonEuroCurrency || highDualUseRisk || highGdprRisk || highRiskCountry

  const parts = getRiskParts(data)

  return {
    state: shouldBePending ? ENTRY_STATES.PENDING : undefined,
    parts,
  }
}
