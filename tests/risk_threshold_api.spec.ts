import { test, expect } from '@playwright/test'
import { testUser } from './helpers'

const baseUrl = 'http://localhost:8000'

const dryrun = async (data: object) => {
  const response = await fetch(`${baseUrl}/api/entries/1/dryrun`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
  expect(response.status).toBe(201)
  return response.json()
}

const baseData = {
  '1': 'Testi Kayttaja',
  '2': testUser,
  '3': 'Test project',
  '4': 'bilateral',
  '6': 'university',
  '9': 'coordinator',
  '10': 'agreementDone',
  '11': ['education'],
  '12': 'shortDuration',
  '13': 'noExternalFunding',
  '16': 'smallBudget',
  '17': 'noTransferPersonalData',
  '23': 'noTransferMilitaryKnowledge',
  '24': 'successfulCollaboration',
  '25': 'noEthicalIssues',
  faculty: 'H40',
  unit: 'H528',
  tuhatProjectExists: 'tuhatOptionNegative',
}

test.describe('dryrun state and parts calculation', () => {
  test('low-risk project has no pending state and empty parts', async () => {
    // Denmark with minimal risk settings → all risks level 1 → no PENDING
    const result = await dryrun({
      ...baseData,
      '8': 'Denmark',
      '20': 'University of Copenhagen',
    })

    expect(result.state).toBeUndefined()
    expect(result.parts).toEqual([])
  })

  test('high total risk triggers PENDING with total part', async () => {
    // Afghanistan with mid-range settings → country + total risk level 3 → PENDING
    // Afghanistan code (AF) is not in HIGH_RISK_COUNTRY_CODES (BY, IL, RU)
    const result = await dryrun({
      ...baseData,
      '8': 'Afghanistan',
      '9': 'partner',
      '10': 'agreementNotDone',
      '11': ['education', 'educationExport'],
      '12': 'mediumDuration',
      '16': 'mediumBudget',
      '20': 'Cardinal Dom Alexandre do Nascimento Polytechnic Institute',
      '24': 'noSuccessfulCollaboration',
    })

    expect(result.state).toBe('PENDING')
    expect(result.parts).toContain('riskComponent:total')
    expect(result.parts).not.toContain('riskComponent:highRiskCountry')
  })

  test('high economic risk triggers PENDING with economicRisk part', async () => {
    // Sweden with external funding + large budget + long duration → economic level 3, total level 2
    const result = await dryrun({
      ...baseData,
      '8': 'Sweden',
      '11': ['education', 'research'],
      '12': 'longDuration',
      '13': 'externalFunding',
      '16': 'largeBudget',
      '20': 'Stockholm University',
    })

    expect(result.state).toBe('PENDING')
    expect(result.parts).toContain('riskComponent:economicRisk')
    // Total risk is 2 for Sweden with these settings, not > 2
    expect(result.parts).not.toContain('riskComponent:total')
    expect(result.parts).not.toContain('riskComponent:highRiskCountry')
  })

  test('high-risk country code (Belarus) triggers PENDING with highRiskCountry part', async () => {
    // Belarus (BY) is in HIGH_RISK_COUNTRY_CODES regardless of risk level
    const result = await dryrun({
      ...baseData,
      '8': 'Belarus',
      '20': 'Belarusian State University',
    })

    expect(result.state).toBe('PENDING')
    expect(result.parts).toContain('riskComponent:highRiskCountry')
  })

  test('non-euro currency triggers PENDING with nonEuroCurrency part', async () => {
    // Denmark (low risk, not in HIGH_RISK_COUNTRY_CODES) + otherCurrency → only currency triggers
    const result = await dryrun({
      ...baseData,
      '8': 'Denmark',
      '20': 'University of Copenhagen',
      '31': 'otherCurrency',
    })

    expect(result.state).toBe('PENDING')
    expect(result.parts).toContain('riskComponent:nonEuroCurrency')
    expect(result.parts).not.toContain('riskComponent:total')
    expect(result.parts).not.toContain('riskComponent:highRiskCountry')
  })

  test('partlyEuros currency triggers PENDING with nonEuroCurrency part', async () => {
    const result = await dryrun({
      ...baseData,
      '8': 'Denmark',
      '20': 'University of Copenhagen',
      '31': 'partlyEuros',
    })

    expect(result.state).toBe('PENDING')
    expect(result.parts).toContain('riskComponent:nonEuroCurrency')
  })

  test('multiple risk factors produce multiple parts', async () => {
    // Afghanistan (total=3) + otherCurrency → both total and nonEuroCurrency in parts
    const result = await dryrun({
      ...baseData,
      '8': 'Afghanistan',
      '9': 'partner',
      '10': 'agreementNotDone',
      '11': ['education', 'educationExport'],
      '12': 'mediumDuration',
      '16': 'mediumBudget',
      '20': 'Cardinal Dom Alexandre do Nascimento Polytechnic Institute',
      '24': 'noSuccessfulCollaboration',
      '31': 'otherCurrency',
    })

    expect(result.state).toBe('PENDING')
    expect(result.parts).toContain('riskComponent:total')
    expect(result.parts).toContain('riskComponent:nonEuroCurrency')
  })
})
