import type { RiskData } from '@types'

const HIGH_RISK_COUNTRY_CODES = ['IL', 'RU', 'BY']

export const getRiskParts = (data: RiskData): string[] => {
  const parts: string[] = []

  const totalRisk = data?.risks?.find((r: any) => r.id === 'total')?.level
  if (totalRisk > 2) {
    parts.push('riskComponent:total')
  }

  const economicRisk = data?.risks?.find((r: any) => r.id === 'economic')?.level
  if (economicRisk === 3) {
    parts.push('riskComponent:economicRisk')
  }

  const nonEuroCurrency = data.answers['31'] === 'otherCurrency' || data.answers['31'] === 'partlyEuros'
  if (nonEuroCurrency) {
    parts.push('riskComponent:nonEuroCurrency')
  }

  const dualUseRisk = data?.risks?.find((r: any) => r.id?.includes('dualUse'))?.level
  if (dualUseRisk === 3) {
    parts.push('riskComponent:dualUseRisk')
  }

  const highGdprRisk = data.country?.some(c => c.gdpr === 3) ?? false
  if (highGdprRisk) {
    parts.push('riskComponent:gdprRisk')
  }

  const allCountries = [...(data.country ?? []), ...(data.multilateralCountries ?? [])]
  if (allCountries.some(c => HIGH_RISK_COUNTRY_CODES.includes(c.code))) {
    parts.push('riskComponent:highRiskCountry')
  }

  return parts
}
