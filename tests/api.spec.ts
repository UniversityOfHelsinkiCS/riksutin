import { test, expect } from '@playwright/test'
import { testUser, riskResponse } from './helpers'

test.describe.configure({ mode: 'serial' })

test.describe('api', () => {
  test('can set filler as the owner', async () => {
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

    const expected = {
      risks: riskResponse([
        { id: 'country', level: 3 },
        { id: 'university', level: 3 },
        { id: 'dualUse', level: 1 },
        { id: 'economic', level: 2 },
        { id: 'ethical', level: 1 },
        { id: 'total', level: 3 },
      ]),
      multilateralCountries: [],
    }

    expect(data.risks).toStrictEqual(expected.risks)
  })
})
