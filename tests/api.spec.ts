import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('api', () => {
  test('can set filler as the owner', async () => {
    const payload = {
      data: {
        '1': 'Testi Kayttaja',
        '2': {
          id: 'hy-hlo-1441871',
          username: 'testuser',
          firstName: 'Testi',
          lastName: 'Kayttaja',
          email: 'grp-toska@helsinki.fi',
          language: 'fi',
          isAdmin: true,
          iamGroups: ['grp-toska', 'hy-mltdk-employees'],
        },
        '3': 'asd',
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
      risks: [
        {
          id: 'country',
          title: 'riskTable:countryRiskLevel',
          level: 3,
        },
        {
          id: 'university',
          title: 'riskTable:universityRiskLevel',
          level: 3,
        },
        {
          id: 'dualUse',
          title: 'riskTable:dualUseRiskLevel',
          level: 1,
        },
        {
          id: 'economic',
          title: 'riskTable:economicRiskLevel',
          level: 2,
        },
        {
          id: 'ethical',
          title: 'riskTable:ethicalRiskLevel',
          level: 1,
        },
        {
          id: 'total',
          title: 'riskTable:totalRiskLevel',
          level: 3,
        },
      ],
      multilateralCountries: [],
    }

    expect(data.risks).toStrictEqual(expected.risks)
  })
})
