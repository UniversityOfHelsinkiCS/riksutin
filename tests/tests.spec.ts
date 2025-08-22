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

  test('has the first question which can be edited', async ({ page }) => {
    await expect(page.getByText('Ilmoittajan nimi')).toBeVisible()

    const nameInput = page.getByTestId('question-1').getByRole('textbox')

    await nameInput.click()
    await nameInput.fill('')

    await expect(nameInput).toHaveValue('')
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
})

test.describe('results', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')
    await page.getByTestId('question-1').getByRole('textbox').click()
    await page.getByTestId('question-1').getByRole('textbox').fill('Testi Testinen')
    await page.getByTestId('question-2').getByRole('textbox').click()
    await page.getByTestId('question-2').getByRole('textbox').fill('CS')
    await page.getByTestId('question-3').getByRole('textbox').click()
    await page.getByTestId('question-3').getByRole('textbox').fill('Projekti')
    await page.getByText('Kahdenvälinen').click()
    await page.getByLabel('Valitse sijaintimaa').click()
    await page.getByRole('option', { name: 'Afghanistan' }).click()
    await page.getByText('Yliopisto', { exact: true }).click()
    await page.getByLabel('Valitse yliopisto').click()
    await page.getByRole('option', { name: 'Kardan University' }).click()
    await page.locator('label').filter({ hasText: 'Kyllä' }).first().click()
    await page.locator('label').filter({ hasText: 'Kumppani tai tasaveroinen' }).click()
    await page.locator('label').filter({ hasText: 'Kyllä' }).nth(1).click()
    await page.locator('label').filter({ hasText: 'Tutkimusyhteistyö' }).click()
    await page.locator('label').filter({ hasText: 'Koulutus/opetusyhteistyö' }).click()
    await page.locator('label').filter({ hasText: '-60kk' }).click()
    await page.locator('label').filter({ hasText: /^Ei$/ }).nth(2).click()
    await page.locator('label').filter({ hasText: '-500.000' }).click()
    await page.locator('label').filter({ hasText: /^Ei$/ }).nth(3).click()
    await page.locator('label').filter({ hasText: /^Ei$/ }).nth(4).click()
    await page.locator('label').filter({ hasText: 'Ei missään tapauksessa' }).click()
    await page.getByRole('button', { name: 'Valinnat tehty' }).click()
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
    await expect(page.locator('b').filter({ hasText: 'Ilmoittajan nimi' })).toBeVisible()
    await expect(page.getByText('Testi Testinen')).toBeVisible()

    await expect(page.locator('b').filter({ hasText: 'Yhteistyön vastuuyksikkö HY:ssa' })).toBeVisible()
    await expect(page.getByText('CS')).toBeVisible()
  })

  test('user page exists and has content', async () => {
    await page.getByRole('link', { name: 'Omat tiedot' }).click()
    await expect(page.getByText('Aikaisemmat riskiarviosi')).toBeVisible()
    await expect(page.getByTestId('entrybox').first()).toBeVisible()
  })
})
