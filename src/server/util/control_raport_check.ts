import { ENTRY_STATES } from '@common/entryStates'
import { getRiskParts } from '@common/getRiskParts'
import { inProduction } from '@config'
import { CONTROL_REPORT_CHECK_DISABLED } from './config'
import sendEmail from './mailer'
import i18n from './i18n'
import logger from './logger'

import type { RiskData } from '@types'
import { Entry, User } from '@dbmodels'

const HIGH_RISK_COUNTRY_CODES = ['IL', 'RU', 'BY']

export const controlRaportCheck = (
  data: RiskData,
  testVersion = false
): { state: string | undefined; parts: string[] } => {
  const totalRisk = (data as any)?.risks?.find((r: any) => r.id === 'total')?.level
  const total = totalRisk > 2

  const economicRisk = (data as any)?.risks?.find((r: any) => r.id === 'economic')?.level
  const highEconomicRisk = economicRisk === 3

  const dualUseRisk = (data as any)?.risks?.find((r: any) => r.id?.includes('dualUse'))?.level
  const highDualUseRisk = dualUseRisk === 3

  const highGdprRisk = data.country?.some(c => c.gdpr === 3) ?? false

  const allCountries = [...(data.country ?? []), ...(data.multilateralCountries ?? [])]
  const highRiskCountry = allCountries.some(c => HIGH_RISK_COUNTRY_CODES.includes(c.code))

  const shouldBePending = total || highEconomicRisk || highDualUseRisk || highGdprRisk || highRiskCountry

  const parts = getRiskParts(data)
  const calculatedState = shouldBePending ? ENTRY_STATES.PENDING : undefined

  const responsibleMail = data.answers?.['2']?.email

  const doNotSetState =
    testVersion || (CONTROL_REPORT_CHECK_DISABLED && responsibleMail !== 'matti.luukkainen@helsinki.fi')

  return {
    state: doNotSetState ? undefined : calculatedState,
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
  if (inProduction) {
    if (!CONTROL_REPORT_CHECK_DISABLED) {
      recipients.push('grp-risk-i@helsinki.fi')
    }
  } else {
    recipients.push('markus.laitinen@helsinki.fi')
  }

  const BASE_URL = inProduction
    ? 'https://risk-i.helsinki.fi/admin/entry'
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
    '<p>Uusi tarkastelua vaativa riskiarvio on luotu.</p>',
    `<p><strong>Hankkeen nimi:</strong> ${projectName}</p>`,
    `<p><strong>Yhteistyön muodot:</strong></p><ul>${collaborationFormsHtml}</ul>`,
    hasExternalFunding ? `<p><strong>Rahoittaja:</strong> ${funder}</p>` : '',
    `<p><strong>Ylittyvät kynnysarvot:</strong></p><ul>${partsListHtml}</ul>`,
    `<p>Tarkastele riskiarviota osoitteessa: <a href="${url}">${url}</a></p>`,
  ].join('')

  await sendEmail(recipients, text, '[risk-i] Uusi tarkastelua vaativa riskiarvio luotu')
  // eslint-disable-next-line no-console
  console.log('PENDING MAIL SEND TO ADMINS', recipients, text)
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

  const language = entry.language === 'fi' ? 'fi' : 'en'
  const projectName: string = entry.data.answers[3] || ''
  const url = `${USER_BASE_URL}/${entry.id}`

  const content = {
    fi: {
      intro:
        `<p>RISK-I -työkalulla tallentamasi riskiarvio ylittää yhden tai useamman määritellyn kynnysarvon eli sen riskitaso on arvioitu korkeaksi. Riskiarviosi on sen takia otettu yliopistopalveluiden riskienarvioinnin ja -hallinnan asiantuntijaryhmän käsittelyyn.  Asiantuntijaryhmän tehtävänä on auttaa sinua varmistamaan, että tunnistetut riskit on hallittu. Ryhmän edustaja joko ottaa sinuun yhteyttä tai kuittaa asian valmiiksi kahden viikon sisällä. Voit seurata asian etenemistä laatimastasi arviosta <a href="${url}">${url}</a>.</p>` +
        '<p>Tutustu yliopiston <a href="https://flamma.helsinki.fi/fi/group/kansainvalisyys/vastuullinen-kansainvalinen-yhteistyo#menu1-2">ohjeistukseen</a> vastuullisen kansainvälisyyden toteuttamisesta erityisesti niiden asioiden osalta, joissa yhteistyösi riskitaso on kohonnut.</p>',
      projectLabel: 'Hankkeen nimi',
      subject: '[risk-i] Riskiarvion käsittely aloitettu',
    },
    en: {
      intro:
        `<p>The risk assessment you completed using RISK-I has exceeded one or more risk thresholds. As a result, your submission will require further review by the University Services' Risk Assessment and Management Group. This group will assist you in ensuring that any elevated risks are appropriately managed. A member of the group will contact you, or confirm that the risks have been addressed, within two weeks. You can monitor the progress of your submission by reviewing it at <a href="${url}">${url}</a>.</p>` +
        '<p>Please also review the <a href="https://flamma.helsinki.fi/en/group/kansainvalisyys/vastuullinen-kansainvalinen-yhteistyo#menu1-2">guidelines</a> for responsible internationalisation, paying particular attention to the areas identified as having elevated risk levels.</p>',
      projectLabel: 'Project name',
      subject: '[risk-i] Risk assessment review started',
    },
  }

  const text = [
    content[language].intro,
    projectName ? `<p><strong>${content[language].projectLabel}:</strong> ${projectName}</p>` : '',
  ].join('')

  await sendEmail(recipients, text, content[language].subject)
  // eslint-disable-next-line no-console
  console.log('PROCESS STARTED MAIL SEND TO', recipients, text)
  logger.info('Control report started notification sent', { entryId: entry.id, recipients, language })
}

export const sendStateDecisionEmail = async (entry: Entry, newState: string) => {
  const recipients = await getFillerRecipients(entry)
  if (recipients.length === 0) {
    logger.warn('No recipients found for state decision notification', { entryId: entry.id })
    return
  }

  const language = entry.language === 'fi' ? 'fi' : 'en'
  const projectName: string = entry.data.answers[3] || ''
  const url = `${USER_BASE_URL}/${entry.id}`

  const content = {
    fi: {
      intro: 'Riskiarvio käsitelty',
      viewDetails: 'katso tiedot osoitteesta',
      projectLabel: 'Hankkeen nimi',
      subject: '[risk-i] Riskiarvio käsitelty',
    },
    en: {
      intro: 'Risk assessment reviewed',
      viewDetails: 'view details at',
      projectLabel: 'Project name',
      subject: '[risk-i] Risk assessment reviewed',
    },
  }

  const text = [
    `<p>${content[language].intro}, ${content[language].viewDetails}: <a href="${url}">${url}</a></p>`,
    projectName ? `<p><strong>${content[language].projectLabel}:</strong> ${projectName}</p>` : '',
  ].join('')

  await sendEmail(recipients, text, content[language].subject)
  // eslint-disable-next-line no-console
  console.log('PROCESS DECIDED MAIL SEND TO', recipients, text)
  logger.info('State decision notification sent', { entryId: entry.id, newState, recipients, language })
}
