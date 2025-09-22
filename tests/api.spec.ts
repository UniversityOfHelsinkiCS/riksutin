import { test, expect } from '@playwright/test'
import { testUser, riskResponse, compareUnordered, compareOrdered } from './helpers'

test.describe.configure({ mode: 'serial' })

test.describe('api', () => {
  test('unilateral project', async () => {
    const payload = {
      data: {
        '1': 'Testi Kayttaja',
        '2': testUser,
        '3': 'Toska',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Afghanistan',
        '9': 'partner',
        '10': 'agreementNotDone',
        '11': ['education', 'educationExport'],
        '12': 'mediumDuration',
        '13': 'noExternalFunding',
        '16': 'mediumBudget',
        '17': 'noTransferPersonalData',
        '20': 'Cardinal Dom Alexandre do Nascimento Polytechnic Institute',
        '23': 'noTransferMilitaryKnowledge',
        '24': 'noSuccessfulCollaboration',
        '25': 'likelyNoEthicalIssues',
        faculty: 'H40',
        unit: 'H528',
        tuhatProjectExists: 'tuhatOptionNegative',
      },
      sessionToken: 'e1e841e1-1368-4deb-b9f9-227ab1261e64',
      tuhatData: {},
    }

    const response = await fetch('http://localhost:8000/api/entries/1/dryrun', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(response.status).toBe(201)

    const data = await response.json()

    const expectedRisks = riskResponse([
      { id: 'country', level: 3 },
      { id: 'dualUse', level: 1 },
      { id: 'economic', level: 2 },
      { id: 'ethical', level: 1 },
      { id: 'total', level: 3 },
      { id: 'university', level: 3 },
    ])

    compareUnordered(data.risks, expectedRisks)
  })

  test('multilateral project', async () => {
    const payload = {
      data: {
        '1': 'Testi Kayttaja',
        '2': testUser,
        '3': 'multilateral gene manipulaton',
        '4': 'multilateral',
        '6': 'otherType',
        '7': '',
        '8': 'Finland',
        '9': 'coordinator',
        '10': 'agreementNotDone',
        '11': ['education', 'educationExport'],
        '12': 'mediumDuration',
        '13': 'noExternalFunding',
        '16': 'largeBudget',
        '17': 'noTransferPersonalData',
        '22': 'unknown',
        '23': 'noTransferMilitaryKnowledge',
        '24': 'successfulCollaboration',
        '25': 'maybeEthicalIssues',
        '26': ['Afghanistan', 'Belarus', 'China'],
        '28': ['Denmark', 'Sweden'],
        faculty: 'H40',
        unit: 'H528',
        tuhatProjectExists: 'tuhatOptionNegative',
      },
      sessionToken: 'e1e841e1-1368-4deb-b9f9-227ab1261e64',
      tuhatData: {},
    }

    const response = await fetch('http://localhost:8000/api/entries/1/dryrun', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(response.status).toBe(201)

    const data = await response.json()

    const expectedRisks = riskResponse([
      { id: 'country', level: 3 },
      { id: 'dualUse', level: 1 },
      { id: 'economic', level: 3 },
      { id: 'ethical', level: 2 },
      { id: 'consortium', level: 3 },
      { id: 'total', level: 3 },
    ])

    compareUnordered(data.risks, expectedRisks)

    const expectedCountries = [
      {
        name: 'Afghanistan',
        code: 'AF',
        countryRisk: {
          rawTotalCountryRiskLevel: 2.75,
        },
      },
      {
        name: 'Belarus',
        code: 'BY',
        countryRisk: {
          rawTotalCountryRiskLevel: 2.625,
        },
      },
      {
        name: 'China',
        code: 'CN',
        countryRisk: {
          rawTotalCountryRiskLevel: 2.375,
        },
      },
      {
        name: 'Denmark',
        code: 'DK',
        countryRisk: {
          rawTotalCountryRiskLevel: 1.2857142857142858,
        },
      },
      {
        name: 'Sweden',
        code: 'SE',
        countryRisk: {
          rawTotalCountryRiskLevel: 1.25,
        },
      },
    ]

    expect(data.country[0].code).toStrictEqual('AF')
    compareOrdered(data.multilateralCountries, expectedCountries)
  })
})
