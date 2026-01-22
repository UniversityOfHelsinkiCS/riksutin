import { test, expect } from '@playwright/test'
import { testUser, riskResponse, compareUnordered, compareOrdered } from './helpers'

const baseUrl = 'http://localhost:8000'

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

    const response = await fetch(`${baseUrl}/api/entries/1/dryrun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(response.status).toBe(201)

    const data = await response.json()

    const expectedRisks = riskResponse([
      { id: 'country', level: 3 },
      { id: 'dualUseNonEU', level: 1 },
      { id: 'economic', level: 2 },
      { id: 'economicScope', level: 2 },
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

    const response = await fetch(`${baseUrl}/api/entries/1/dryrun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(response.status).toBe(201)

    const data = await response.json()

    const expectedRisks = riskResponse([
      { id: 'country', level: 3 },
      { id: 'dualUseNonEU', level: 1 },
      { id: 'economic', level: 3 },
      { id: 'economicScope', level: 3 },
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

  test('editing an entry', async () => {
    const initialPayload = {
      data: {
        '1': 'Testi Kayttaja',
        '2': testUser,
        '3': 'Initial Project',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Afghanistan',
        '9': 'partner',
        '10': 'agreementNotDone',
        '11': ['education'],
        '12': 'mediumDuration',
        '13': 'noExternalFunding',
        '16': 'mediumBudget',
        '17': 'noTransferPersonalData',
        '20': 'Kardan University',
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

    const createResponse = await fetch(`${baseUrl}/api/entries/1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initialPayload),
    })

    expect(createResponse.status).toBe(201)
    const createdEntry = await createResponse.json()

    let updatedPayload = {
      data: {
        '1': 'Testi Kayttaja',
        '2': testUser,
        '3': 'Updated Project Name',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Sweden',
        '9': 'coordinator',
        '10': 'agreementDone',
        '11': ['education', 'research'],
        '12': 'longDuration',
        '13': 'externalFunding',
        '16': 'largeBudget',
        '17': 'noTransferPersonalData',
        '20': 'Ahlobait University',
        '23': 'noTransferMilitaryKnowledge',
        '24': 'successfulCollaboration',
        '25': 'likelyNoEthicalIssues',
        faculty: 'H40',
        unit: 'H528',
        tuhatProjectExists: 'tuhatOptionNegative',
      },
      tuhatData: {},
    }

    let updateResponse = await fetch(`${baseUrl}/api/entries/${createdEntry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    })

    expect(updateResponse.status).toBe(200)

    let updatedEntry = await updateResponse.json()

    let expectedRisks = riskResponse([
      { id: 'country', level: 1 },
      { id: 'dualUseEU', level: 1 },
      { id: 'economic', level: 3 },
      { id: 'economicScope', level: 3 },
      { id: 'ethical', level: 1 },
      { id: 'total', level: 2 },
      { id: 'university', level: 1 },
    ])

    compareUnordered(updatedEntry.data.risks, expectedRisks)

    expect(updatedEntry.data.country[0].code).toBe('SE')

    expect(updatedEntry.data.updatedData).toBeDefined()
    expect(updatedEntry.data.updatedData.length).toBe(1)
    expect(updatedEntry.data.updatedData[0].country[0].code).toBe('AF')

    updatedPayload = {
      data: {
        '1': 'Testi Kayttaja',
        '2': testUser,
        '3': 'Updated Project Name',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Denmark',
        '9': 'coordinator',
        '10': 'agreementDone',
        '11': ['education', 'research'],
        '12': 'shortDuration',
        '13': 'noExternalFunding',
        '16': 'smallBudget',
        '17': 'noTransferPersonalData',
        '20': 'Ahlobait University',
        '23': 'noTransferMilitaryKnowledge',
        '24': 'successfulCollaboration',
        '25': 'likelyNoEthicalIssues',
        faculty: 'H40',
        unit: 'H528',
        tuhatProjectExists: 'tuhatOptionNegative',
      },
      tuhatData: {},
    }

    updateResponse = await fetch(`${baseUrl}/api/entries/${createdEntry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    })

    expect(updateResponse.status).toBe(200)

    updatedEntry = await updateResponse.json()

    expectedRisks = riskResponse([
      { id: 'country', level: 1 },
      { id: 'dualUseEU', level: 1 },
      { id: 'economic', level: 1 },
      { id: 'economicScope', level: 1 },
      { id: 'ethical', level: 1 },
      { id: 'total', level: 1 },
      { id: 'university', level: 1 },
    ])

    compareUnordered(updatedEntry.data.risks, expectedRisks)

    expect(updatedEntry.data.country[0].code).toBe('DK')

    expect(updatedEntry.data.updatedData).toBeDefined()
    expect(updatedEntry.data.updatedData.length).toBe(2)
    expect(updatedEntry.data.updatedData[0].country[0].code).toBe('AF')
    expect(updatedEntry.data.updatedData[1].country[0].code).toBe('SE')
  })

  test('only creator can view and edit an entry', async () => {
    await fetch(`${baseUrl}/api/mock/user?type=admin`)

    const initialPayload = {
      data: {
        '1': 'Admin Creator',
        '2': testUser,
        '3': 'Admin Project',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Afghanistan',
        '9': 'partner',
        '10': 'agreementNotDone',
        '11': ['education'],
        '12': 'mediumDuration',
        '13': 'noExternalFunding',
        '16': 'mediumBudget',
        '17': 'noTransferPersonalData',
        '20': 'Kardan University',
        '23': 'noTransferMilitaryKnowledge',
        '24': 'noSuccessfulCollaboration',
        '25': 'likelyNoEthicalIssues',
        faculty: 'H40',
        unit: 'H528',
        tuhatProjectExists: 'tuhatOptionNegative',
      },
      sessionToken: 'access-control-test-session',
      tuhatData: {},
    }

    const createResponse = await fetch(`${baseUrl}/api/entries/1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initialPayload),
    })

    expect(createResponse.status).toBe(201)
    const createdEntry = await createResponse.json()
    const entryId = createdEntry.id
    await fetch(`${baseUrl}/api/mock/user?type=normal`)

    const getResponse = await fetch(`${baseUrl}/api/entries/${entryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(getResponse.status).toBe(401)
    const getError = await getResponse.json()
    expect(getError.error).toContain('Unauthorized')

    const updatePayload = {
      data: {
        '1': 'Unauthorized Edit',
        '2': testUser,
        '3': 'Should Not Work',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Sweden',
        '9': 'partner',
        '10': 'agreementDone',
        '11': ['education', 'research'],
        '12': 'mediumDuration',
        '13': 'noExternalFunding',
        '16': 'mediumBudget',
        '17': 'noTransferPersonalData',
        '20': 'Kardan University',
        '23': 'noTransferMilitaryKnowledge',
        '24': 'successfulCollaboration',
        '25': 'likelyNoEthicalIssues',
        faculty: 'H40',
        unit: 'H528',
        tuhatProjectExists: 'tuhatOptionNegative',
      },
      tuhatData: {},
    }

    const putResponse = await fetch(`${baseUrl}/api/entries/${entryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    })

    expect(putResponse.status).toBe(401)
    const putError = await putResponse.json()
    expect(putError.error).toContain('Unauthorized')
  })
})
