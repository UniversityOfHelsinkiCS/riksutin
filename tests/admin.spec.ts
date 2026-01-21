import { test, expect } from '@playwright/test'
import { testUser } from './helpers'

test.describe.configure({ mode: 'serial' })

test.describe('entry access control', () => {
  const baseUrl = 'http://localhost:8000'
  let createdEntryId: string

  test('admin can create an entry', async () => {
    // Set user as admin
    await fetch(`${baseUrl}/mock/user?type=admin`)

    const payload = {
      data: {
        '1': 'Admin User',
        '2': testUser,
        '3': 'Test Project',
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
      sessionToken: 'test-session-token',
      tuhatData: {},
    }

    const response = await fetch(`${baseUrl}/api/entries/1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(response.status).toBe(201)
    const entry = await response.json()
    createdEntryId = entry.id
    expect(createdEntryId).toBeDefined()
  })

  test('normal user cannot access entry created by admin', async () => {
    // Change user to normal
    await fetch(`${baseUrl}/mock/user?type=normal`)

    const response = await fetch(`${baseUrl}/api/entries/${createdEntryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toContain('Unauthorized')
  })

  test('normal user cannot edit entry created by admin', async () => {
    // Ensure user is still normal
    await fetch(`${baseUrl}/mock/user?type=normal`)

    const payload = {
      data: {
        '1': 'Modified by Normal User',
        '2': testUser,
        '3': 'Modified Project',
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

    const response = await fetch(`${baseUrl}/api/entries/${createdEntryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toContain('Unauthorized')
  })

  test('admin creator can still access and edit their entry', async () => {
    // Change back to admin
    await fetch(`${baseUrl}/mock/user?type=admin`)

    // Test GET
    const getResponse = await fetch(`${baseUrl}/api/entries/${createdEntryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(getResponse.status).toBe(200)
    const entry = await getResponse.json()
    expect(entry.id).toBe(createdEntryId)

    // Test PUT
    const payload = {
      data: {
        '1': 'Admin Modified',
        '2': testUser,
        '3': 'Admin Modified Project',
        '4': 'bilateral',
        '6': 'university',
        '8': 'Denmark',
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

    const putResponse = await fetch(`${baseUrl}/api/entries/${createdEntryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(putResponse.status).toBe(200)
    const updatedEntry = await putResponse.json()
    expect(updatedEntry.id).toBe(createdEntryId)
  })
})

test.describe('admin endpoints access control', () => {
  const baseUrl = 'http://localhost:8000'

  test.describe('when user is not admin', () => {
    test.beforeEach(async () => {
      // Set mock user to normal before each test
      await fetch(`${baseUrl}/mock/user?type=normal`)
    })

    test('PUT /api/surveys/:name is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/surveys/universitysurvey`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: true }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('POST /api/questions/:surveyId is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: 1,
          parentId: null,
          priority: 999,
          title: { fi: 'Test', en: 'Test' },
          text: { fi: 'Test question', en: 'Test question' },
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('PUT /api/questions/:id is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { fi: 'Updated', en: 'Updated' },
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('PUT /api/questions/:id/location is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/1/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: 10,
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('DELETE /api/questions/:id is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/999`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('POST /api/questions/:id/option is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/1/option`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { fi: 'Test option', en: 'Test option' },
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('PUT /api/questions/:id/option/:optionId is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/1/option/option1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { fi: 'Updated option', en: 'Updated option' },
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('DELETE /api/questions/:id/option/:optionId is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/questions/1/option/option999`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('POST /api/warnings is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/warnings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: 'FI',
          surveyId: 1,
          type: 'info',
          title: { fi: 'Test', en: 'Test' },
          content: { fi: 'Test warning', en: 'Test warning' },
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('PUT /api/warnings/:id is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/warnings/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { fi: 'Updated', en: 'Updated' },
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('DELETE /api/warnings/:id is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/warnings/999`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('GET /api/countries/cache/flush is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/countries/cache/flush`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('GET /api/countries/cache/highrisk is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/countries/cache/highrisk`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    test('GET /api/explode is not accessible', async () => {
      const response = await fetch(`${baseUrl}/api/explode`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })
  })
})
