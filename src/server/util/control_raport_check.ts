import { ENTRY_STATES } from '@common/entryStates'
import { getRiskParts } from '@common/getRiskParts'
import { inProduction } from '@config'
import sendEmail from './mailer'
import i18n from './i18n'
import logger from './logger'

import type { RiskData } from '@types'
import { Entry, User } from '@dbmodels'

const HIGH_RISK_COUNTRY_CODES = ['IL', 'RU', 'BY']

export const controlRaportCheck = (data: RiskData): { state: string | undefined; parts: string[] } => {
  const totalRisk = (data as any)?.risks?.find((r: any) => r.id === 'total')?.level
  const total = totalRisk > 2

  const economicRisk = (data as any)?.risks?.find((r: any) => r.id === 'economic')?.level
  const highEconomicRisk = economicRisk === 3

  const nonEuroCurrency = data.answers['31'] === 'otherCurrency' || data.answers['31'] === 'partlyEuros'

  const dualUseRisk = (data as any)?.risks?.find((r: any) => r.id?.includes('dualUse'))?.level
  const highDualUseRisk = dualUseRisk === 3

  const highGdprRisk = data.country?.some(c => c.gdpr === 3) ?? false

  const allCountries = [...(data.country ?? []), ...(data.multilateralCountries ?? [])]
  const highRiskCountry = allCountries.some(c => HIGH_RISK_COUNTRY_CODES.includes(c.code))

  const shouldBePending =
    total || highEconomicRisk || nonEuroCurrency || highDualUseRisk || highGdprRisk || highRiskCountry

  const parts = getRiskParts(data)

  return {
    state: shouldBePending ? ENTRY_STATES.PENDING : undefined,
    parts,
  }
}

const COLLABORATION_FORM_LABELS: Record<string, string> = {
  research: 'Tutkimusyhteistyö',
  education: 'Koulutus/opetusyhteistyö',
  educationExport: 'Koulutusvienti',
  studentMobility: 'Kansainvälinen opiskelijaliikkuvuus',
  staffMobility: 'Kansainvälinen henkilöstöliikkuvuus',
  jointDegree: 'Yhteistutkintoyhteistyö',
  branchCampus: 'Etäkampus',
  otherCollaboration: 'Muu',
}

export const sendPendingEntryEmail = async (entryId: number, parts: string[], riskData: RiskData) => {
  const recipients = ['matti.luukkainen@helsinki.fi']
  const BASE_URL = inProduction
    ? 'https://risk-i.helsinki.fi/admin'
    : 'https://riksutin.ext.ocp-test-0.k8s.it.helsinki.fi/admin/entry'
  const url = `${BASE_URL}/${entryId}`
  const t = i18n.getFixedT('fi')
  const partsListHtml = parts.map(p => `<li>${t(p)}</li>`).join('')

  const projectName: string = riskData.answers[3] || ''
  const collaborationForms: string[] = Array.isArray(riskData.answers[11]) ? riskData.answers[11] : []
  const collaborationFormsHtml = collaborationForms.map(f => `<li>${COLLABORATION_FORM_LABELS[f] ?? f}</li>`).join('')
  const hasExternalFunding = riskData.answers[13] === 'externalFunding'
  const funder: string = riskData.answers[32] || ''

  const text = [
    '<p>Uusi tarkastelua vaativa riskiarvio luotu.</p>',
    `<p><strong>Hankkeen nimi:</strong> ${projectName}</p>`,
    `<p><strong>Yhteistyön muodot:</strong></p><ul>${collaborationFormsHtml}</ul>`,
    hasExternalFunding ? `<p><strong>Rahoittaja:</strong> ${funder}</p>` : '',
    `<p><strong>Ylittyvät kynnysarvot:</strong></p><ul>${partsListHtml}</ul>`,
    `<p>Tarkastele riskiarviota osoitteessa: <a href="${url}">${url}</a></p>`,
  ].join('')

  await sendEmail(recipients, text, '[risk-i] Uusi tarkastelua vaativa riskiarvio luotu')
  // eslint-disable-next-line no-console
  console.log('MAIL SEND', text)
}

const EXCLUDED_RECIPIENTS = ['testi.kayttaja@example.org']

const getFillerRecipients = async (entry: Entry): Promise<string[]> => {
  const creator = await User.findByPk(entry.userId)
  const owner = await User.findByPk(entry.ownerId)
  const recipients: string[] = []
  if (creator?.email) {
    recipients.push(creator.email)
  }
  if (owner?.email && owner.id !== creator?.id) {
    recipients.push(owner.email)
  }
  return recipients.filter(r => !EXCLUDED_RECIPIENTS.includes(r))
}

const USER_BASE_URL = inProduction
  ? 'https://risk-i.helsinki.fi/user'
  : 'https://riksutin.ext.ocp-test-0.k8s.it.helsinki.fi/user'

export const sendControlReportStartedEmail = async (entry: Entry) => {
  const recipients = await getFillerRecipients(entry)
  if (recipients.length === 0) {
    logger.warn('No recipients found for control report started notification', { entryId: entry.id })
    return
  }

  const projectName: string = entry.data.answers[3] || ''
  const url = `${USER_BASE_URL}/${entry.id}`

  const text = [
    '<p>Riskiarviotasi on alettu käsittelemään.</p>',
    projectName ? `<p><strong>Hankkeen nimi:</strong> ${projectName}</p>` : '',
    `<p>Katso tiedot osoitteesta: <a href="${url}">${url}</a></p>`,
  ].join('')

  await sendEmail(recipients, text, '[risk-i] Riskiarvion käsittely aloitettu')
  logger.info('Control report started notification sent', { entryId: entry.id, recipients })
}

export const sendStateDecisionEmail = async (entry: Entry, newState: string) => {
  const recipients = await getFillerRecipients(entry)
  if (recipients.length === 0) {
    logger.warn('No recipients found for state decision notification', { entryId: entry.id })
    return
  }

  const projectName: string = entry.data.answers[3] || ''
  const url = `${USER_BASE_URL}/${entry.id}`

  const text = [
    `<p>Riskiarvio käsitelty, katso tiedot osoitteesta: <a href="${url}">${url}</a></p>`,
    projectName ? `<p><strong>Hankkeen nimi:</strong> ${projectName}</p>` : '',
  ].join('')

  const subject = '[risk-i] Riskiarvio käsitelty'

  await sendEmail(recipients, text, subject)
  logger.info('State decision notification sent', { entryId: entry.id, newState, recipients })
}
