import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

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
