import { test, expect, type Page, type BrowserContext } from '@playwright/test'

const baseUrl = 'http://localhost:8000'

test.describe.configure({ mode: 'serial' })

test.describe('käsittelytoimenpide feature', () => {
  let page: Page
  let context: BrowserContext
  let entryId: string

  test.beforeAll(async ({ browser }) => {
    // Set mock user to admin
    await fetch(`${baseUrl}/api/mock/user?type=admin`)

    // Delete any existing "Korkean riskin projekti" entries from previous test runs
    const entriesRes = await fetch(`${baseUrl}/api/entries`, {
      headers: { 'Content-Type': 'application/json' },
    })
    const entries = await entriesRes.json()
    for (const entry of entries) {
      if (entry.data?.answers?.['3'] === 'Korkean riskin projekti') {
        // eslint-disable-next-line no-await-in-loop
        await fetch(`${baseUrl}/api/entries/${entry.id}/delete`, { method: 'DELETE' })
      }
    }

    // Reset mail mock
    await fetch('http://localhost:3000/pate/reset')

    context = await browser.newContext({
      recordVideo: { dir: 'test-results/videos', size: { width: 640, height: 480 } },
    })
    page = await context.newPage()
  })

  test.afterAll(async () => {
    // Reset mock user to normal so other tests are not affected
    await fetch(`${baseUrl}/api/mock/user?type=normal`)
    await page.close()
    await context.close()
  })

  test('creating a high risk entry sets PENDING state and sends notification email', async () => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Olen projektin omistaja' }).click()

    const autocompleteInput = page.locator('#unit')
    await autocompleteInput.fill('ti')
    const options = page.locator('.MuiAutocomplete-option')
    await options.filter({ hasText: 'Tietojenkäsittelytieteen osasto' }).first().click()

    await page.locator('[data-cy="choice-select-tuhatOptionNegative"]').click()
    await page.getByTestId('question-tuhatProjText').getByRole('textbox').click()
    await page.getByTestId('question-tuhatProjText').getByRole('textbox').fill('Korkean riskin projekti')

    await page.locator('[data-cy="choice-select-bilateral"]').click()

    await page.getByLabel('Valitse sijaintimaa').click()
    await page.getByRole('option', { name: 'Afghanistan' }).click()

    await page.locator('[data-cy="choice-select-university"]').click()
    await page.getByLabel('Valitse yliopisto').click()
    await page.getByRole('option', { name: 'Kardan University' }).click()

    await page.locator('[data-cy="choice-select-noSuccessfulCollaboration"]').click()
    await page.locator('[data-cy="choice-select-partner"]').click()
    await page.locator('[data-cy="choice-select-agreementNotDone"]').click()

    await page.locator('input[value="education"]').check()
    await page.locator('input[value="educationExport"]').check()

    await page.locator('[data-cy="choice-select-mediumDuration"]').click()
    await page.locator('[data-cy="choice-select-noExternalFunding"]').click()
    await page.locator('[data-cy="choice-select-mediumBudget"]').click()
    await page.locator('[data-cy="choice-select-transferPersonalData"]').click()
    await page.locator('[data-cy="choice-select-noTransferMilitaryKnowledge"]').click()

    await page.locator('[data-cy="choice-select-noEthicalIssues"]').click()

    await page.getByTestId('question-7').getByRole('textbox').click()
    await page.getByTestId('question-7').getByRole('textbox').fill('Testi käsittelytoimenpiteille')

    await page.getByRole('button', { name: 'Tallenna' }).click()
    await expect(page.getByText('Yhteenveto valinnoistasi')).toBeVisible()

    // Extract entryId from URL (e.g. /user/5)
    const url = page.url()
    const match = /\/user\/(\d+)/.exec(url)
    expect(match).toBeTruthy()
    entryId = match![1]

    // Verify notification email was sent
    const response = await fetch('http://localhost:3000/pate')
    const data = await response.json()
    expect(data.length).toBeGreaterThanOrEqual(1)

    const pendingEmail = data.find((m: any) =>
      m.emails?.some((e: any) => e.subject === '[risk-i] Uusi tarkastelua vaativa riskiarvio luotu')
    )
    expect(pendingEmail).toBeTruthy()
  })

  test('user entry page shows PENDING state chip and risk thresholds', async () => {
    await page.goto(`/user/${entryId}`)

    await expect(page.getByTestId('control-reports-section')).toBeVisible()
    await expect(page.getByTestId('entry-state-chip')).toBeVisible()
    await expect(page.getByTestId('entry-state-chip')).toContainText('Edellyttää asiantuntijaryhmän käsittelyä')
    await expect(page.getByTestId('risk-threshold-parts')).toBeVisible()
  })

  test('admin entry page shows PENDING state chip with admin controls', async () => {
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('control-reports-section')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('entry-state-chip')).toBeVisible()
    await expect(page.getByTestId('entry-state-chip')).toContainText('Edellyttää asiantuntijaryhmän käsittelyä')
    await expect(page.getByTestId('add-report-button')).toBeVisible()
  })

  test('user list page shows PENDING state chip', async () => {
    await page.goto('/user')

    const entryLink = page.getByRole('link', { name: 'Korkean riskin projekti' })
    await expect(entryLink).toBeVisible()

    const stateChips = page.getByTestId('entry-state-chip')
    await expect(stateChips.first()).toBeVisible()
    await expect(stateChips.first()).toContainText('Edellyttää asiantuntijaryhmän käsittelyä')
  })

  test('admin summary page shows PENDING state chip', async () => {
    await page.goto('/admin/summary')

    const stateChips = page.getByTestId('entry-state-chip')
    await expect(stateChips.first()).toBeVisible()
    await expect(stateChips.first()).toContainText('Edellyttää asiantuntijaryhmän käsittelyä')
  })

  test('admin adds a control report and state transitions to EXPERT_GROUP', async () => {
    await fetch(`${baseUrl}/api/mock/user?type=admin`)
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    // Open the add control report dialog
    await page.getByRole('button', { name: 'Lisää Käsittelytoimenpide' }).click()

    // Fill in the textarea and save
    await page.getByRole('dialog').getByRole('textbox').fill('Tämä on ensimmäinen toimenpide')
    await page.screenshot({ path: 'test-results/debug-before-save.png' })
    await page.getByRole('dialog').getByRole('button', { name: 'Tallenna' }).click()

    // Wait a moment for snackbar or dialog to react
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/debug-after-save.png' })

    // Report text should appear in a report card
    await expect(page.getByTestId('control-report-item').getByText('Tämä on ensimmäinen toimenpide')).toBeVisible()

    // State should have auto-transitioned from PENDING to EXPERT_GROUP
    await expect(page.getByTestId('entry-state-chip')).toContainText('Otettu asiantuntijaryhmän käsittelyyn')
  })

  test('normal report is visible in user entry page with EXPERT_GROUP state', async () => {
    await page.goto(`/user/${entryId}`)

    await expect(page.getByTestId('control-report-item').getByText('Tämä on ensimmäinen toimenpide')).toBeVisible()
    await expect(page.getByTestId('entry-state-chip')).toContainText('Otettu asiantuntijaryhmän käsittelyyn')
  })

  test('normal report is visible in admin entry page with EXPERT_GROUP state', async () => {
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('control-report-item').getByText('Tämä on ensimmäinen toimenpide')).toBeVisible()
    await expect(page.getByTestId('entry-state-chip')).toContainText('Otettu asiantuntijaryhmän käsittelyyn')
  })

  test('admin adds an admin-only control report', async () => {
    // Create admin-only control report via API
    const response = await fetch(`${baseUrl}/api/entries/${entryId}/control-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Tämä on salainen toimenpide', adminOnly: true }),
    })
    expect(response.status).toBe(201)

    // Reload admin entry page to verify
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    // Admin-only report should appear with the admin-only marker
    await expect(page.getByTestId('control-report-admin-only').getByText('Tämä on salainen toimenpide')).toBeVisible()
    await expect(page.getByTestId('control-report-admin-only')).toBeVisible()
  })

  test('admin-only report is NOT visible in user entry page', async () => {
    await page.goto(`/user/${entryId}`)

    // Normal report should still be visible
    await expect(page.getByTestId('control-report-item').getByText('Tämä on ensimmäinen toimenpide')).toBeVisible()

    // Admin-only report should NOT be visible
    await expect(page.getByText('Tämä on salainen toimenpide')).not.toBeVisible()
  })

  test('admin-only report IS visible in admin entry page', async () => {
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('control-report-admin-only').getByText('Tämä on salainen toimenpide')).toBeVisible()
    await expect(page.getByTestId('control-report-item').getByText('Tämä on ensimmäinen toimenpide')).toBeVisible()
    await expect(page.getByTestId('control-report-admin-only')).toBeVisible()
  })

  test('admin changes entry state to APPROVED', async () => {
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    // Click "Vaihda vaihetta" to open the state selector
    await page.getByRole('button', { name: 'Vaihda vaihetta' }).click()

    // Select APPROVED radio option
    await page.getByLabel('Asia käsitelty, hanke voi edetä käsittelytoimenpiteissä yksilöidyllä tavalla').click()

    // Confirm the state change dialog
    await page.getByRole('dialog').getByRole('button', { name: 'Vahvista' }).click()

    // State chip should now show APPROVED
    await expect(page.getByTestId('entry-state-chip')).toContainText(
      'Asia käsitelty, hanke voi edetä käsittelytoimenpiteissä yksilöidyllä tavalla'
    )
  })

  test('state change to APPROVED is reflected in user entry page', async () => {
    await page.goto(`/user/${entryId}`)

    await expect(page.getByTestId('entry-state-chip')).toContainText(
      'Asia käsitelty, hanke voi edetä käsittelytoimenpiteissä yksilöidyllä tavalla'
    )
  })

  test('state change history is visible in admin entry page', async () => {
    await page.goto(`/admin/entry/${entryId}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('entry-state-chip')).toContainText(
      'Asia käsitelty, hanke voi edetä käsittelytoimenpiteissä yksilöidyllä tavalla'
    )

    // State change history should show the transitions
    const history = page.getByTestId('state-change-history')
    await expect(history).toBeVisible()
    // Auto-transition: PENDING -> EXPERT_GROUP
    await expect(history).toContainText('Edellyttää asiantuntijaryhmän käsittelyä')
    await expect(history).toContainText('Otettu asiantuntijaryhmän käsittelyyn')
    // Manual transition: EXPERT_GROUP -> APPROVED
    await expect(history).toContainText('Asia käsitelty, hanke voi edetä käsittelytoimenpiteissä yksilöidyllä tavalla')
  })
})
