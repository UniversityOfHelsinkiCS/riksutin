// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { test, expect, type Page } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Risk-i/)
})

test.describe.configure({ mode: 'serial' })

test.describe('form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('can set filler as the owner', async ({ page }) => {
    await page.getByRole('button', { name: 'Olen projektin omistaja' }).click()

    const input = page.locator('#select-2')
    await expect(input).toHaveValue('Testi Kayttaja (grp-toska@helsinki.fi)')
  })

  test('owner can be selected', async ({ page }) => {
    const autocompleteInput = page.locator('#select-2')
    await autocompleteInput.fill('a')

    const options = page.locator('.MuiAutocomplete-option')
    await expect(options).toHaveCount(3)

    await options.filter({ hasText: 'Outi' }).first().click()

    await expect(autocompleteInput).toHaveValue('Outi Savolainen (outi.savolainen@helsinki.fi)')
  })

  test('selecting a country shows a list of universities', async ({ page }) => {
    await page.getByLabel('Valitse sijaintimaa').click()
    await page.getByRole('option', { name: 'Afghanistan' }).click()
    await page.getByText('Yliopisto', { exact: true }).click()
    await page.getByLabel('Valitse yliopisto').click()
    await expect(page.getByRole('option', { name: 'Kardan University' })).toBeVisible()
  })

  test('organisation select works', async ({ page }) => {
    await page.getByLabel('Muu tutkimuslaitos').check()

    const organisationSelectInput = page.getByTestId('question-22').getByRole('textbox')
    await organisationSelectInput.click()
    await organisationSelectInput.fill('helsingin yliopisto')
    await page.getByLabel('Organisaatio').click()
    await expect(page.getByRole('option', { name: 'HELSINGIN YLIOPISTO', exact: true })).toBeVisible()
  })

  test('Tuhat project can be selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Olen projektin omistaja' }).click()

    await page.locator('[data-cy="choice-select-tuhatOptionPositive"]').click()
    await page.locator('[data-cy="tuhatProject-select"]').click()
    await page.locator('text="AI akatemia"').click()

    await page.getByLabel('Valitse sijaintimaa').click()
  })
})

test.describe('results', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')
    await page.getByRole('button', { name: 'Olen projektin omistaja' }).click()

    const autocompleteInput = page.locator('#unit')
    await autocompleteInput.fill('ti')
    const options = page.locator('.MuiAutocomplete-option')
    await options.filter({ hasText: 'Tietojenkäsittelytieteen osasto' }).first().click()

    // TUHAT negative
    await page.locator('[data-cy="choice-select-tuhatOptionNegative"]').click()
    await page.getByTestId('question-tuhatProjText').getByRole('textbox').click()
    await page.getByTestId('question-tuhatProjText').getByRole('textbox').fill('Tuska')

    await page.locator('[data-cy="choice-select-bilateral"]').click()

    await page.getByLabel('Valitse sijaintimaa').click()
    await page.getByRole('option', { name: 'Afghanistan' }).click()

    await page.locator('[data-cy="choice-select-university"]').click()
    await page.getByLabel('Valitse yliopisto').click()
    await page.getByRole('option', { name: 'Kardan University' }).click()

    await page.locator('[data-cy="choice-select-succefultCollaboration"]').click()
    await page.locator('[data-cy="choice-select-partner"]').click()
    await page.locator('[data-cy="choice-select-agreementDone"]').click()

    await page.locator('input[value="education"]').check()
    await page.locator('input[value="research"]').check()

    await page.locator('[data-cy="choice-select-mediumDuration"]').click()

    await page.locator('[data-cy="choice-select-noExternalFunding"]').click()

    await page.locator('[data-cy="choice-select-mediumBudget"]').click()
    await page.locator('[data-cy="choice-select-transferPersonalData"]').click()
    await page.locator('[data-cy="choice-select-noTransferMilitaryKnowledge"]').click()

    await page.locator('[data-cy="choice-select-noEthicalIssues"]').click()

    await page.getByTestId('question-7').getByRole('textbox').click()
    await page.getByTestId('question-7').getByRole('textbox').fill('Testiprojekti')

    await page.getByRole('button', { name: 'Valinnat tehty' }).click()

    await expect(page.getByText('Yhteenveto valinnoistasi')).toBeVisible()
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('risk table and answers are visible after submitting', async () => {
    await expect(page.getByText('Yhteistyön riskit')).toBeVisible()
    await expect(page.getByText('Yhteenveto valinnoistasi')).toBeVisible()
  })

  test('risk table has content', async () => {
    await expect(page.getByText('Yhteistyön kokonaisriskitaso', { exact: true })).toBeVisible()
    await expect(page.getByText('Maan riskitaso', { exact: true })).toBeVisible()
    await expect(page.getByText('Korruptio', { exact: true })).toBeVisible()
    await expect(page.getByText('Akateeminen vapaus', { exact: true })).toBeVisible()
    await expect(page.getByText('Poliittinen vakaus', { exact: true })).toBeVisible()
    await expect(page.getByText('Maan kehittyneisyys', { exact: true })).toBeVisible()
    await expect(page.getByText('GDPR', { exact: true })).toBeVisible()
    await expect(page.getByText('Pakotteet', { exact: true })).toBeVisible()
    await expect(page.getByText('Yliopiston riskitaso', { exact: true })).toBeVisible()
    await expect(page.getByText('Kaksikäyttötuotteiden riskitaso', { exact: true })).toBeVisible()
    await expect(page.getByText('Eettinen riskitaso', { exact: true })).toBeVisible()
  })

  test('answers section contains the question and the response', async () => {
    const owner = page.locator('#question-2')
    await expect(owner).toBeVisible()
    await expect(owner.getByText('Projektin omistaja')).toBeVisible()
    await expect(owner).toContainText('Testi Kayttaja (grp-toska@helsinki.fi)')

    const organization = page.locator('#question-3')
    await expect(organization.getByText('Projektin omistava yksikkö')).toBeVisible()
    await expect(organization.getByText('H523 - Tietojenkäsittelytieteen osasto')).toBeVisible()
  })

  test('user page exists and has content', async () => {
    await page.getByRole('link', { name: 'Aiemmat arviot' }).click()
    await expect(page.getByText('Aikaisemmat riskiarviosi')).toBeVisible()
    await expect(page.getByTestId('entrybox').first()).toBeVisible()
    const projectLinks = page.getByRole('link', { name: 'Tuska' })
    await expect(projectLinks.first()).toBeVisible()
  })
})
