import { Entry, EntryStateChange } from '@dbmodels'
import { Op } from 'sequelize'

import { ENTRY_STATES } from '@common/entryStates'
import { expertGroupEmail } from '@config'
import logger from '../../logger'
import scheduleCronJob from '../schedule'
import sendEmail from '../../mailer'

const RECIPIENTS = ['matti.luukkainen@helsinki.fi', expertGroupEmail]
const APP_URL = 'risk-i.helsinki.fi'

const weeksAgo = (weeks: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - weeks * 7)
  return date
}

const isFirstMondayOfMonth = (): boolean => {
  const now = new Date()
  return now.getDay() === 1 && now.getDate() <= 7
}

const entryLink = (entryId: number): string => `https://${APP_URL}/admin/entries/${entryId}`

const formatEntryLine = (entry: Entry): string => {
  const projectName: string = entry.data?.answers?.[3] ?? `Entry #${entry.id}`
  const url = entryLink(entry.id)
  return `<li><strong>${projectName}</strong>: <a href="${url}">${url}</a></li>`
}

const getPendingEntries = async (): Promise<Entry[]> => {
  const TWO = 2
  const twoWeeksAgo = weeksAgo(TWO)

  const staleStateChanges = await EntryStateChange.findAll({
    where: {
      toState: ENTRY_STATES.PENDING,
      createdAt: { [Op.lte]: twoWeeksAgo },
    },
  })

  if (staleStateChanges.length === 0) {
    return []
  }

  const entryIds = staleStateChanges.map(sc => sc.entryId)

  return Entry.findAll({
    where: {
      id: { [Op.in]: entryIds },
      state: ENTRY_STATES.PENDING,
    },
  })
}

const runPendingCheck = async (): Promise<void> => {
  const entries = await getPendingEntries()

  if (entries.length === 0) {
    logger.info('stateMonitor: no entries still in PENDING state')
    return
  }

  const lines = entries.map(formatEntryLine).join('')
  const subject = 'Risk-i: käsittelemättömiä riskiarvioita'
  const text = `<p>Seuraavien riskiarvioiden luomisesta on kulunut yli kaksi viikkoa:</p><ul>${lines}</ul>`

  logger.info(`stateMonitor: sending PENDING alert for ${entries.length} entries`)
  await sendEmail(RECIPIENTS, text, subject)
}

const getExpertGroupEntries = async (): Promise<Entry[]> => {
  const FOUR = 4
  const fourWeeksAgo = weeksAgo(FOUR)

  const oldPendingChanges = await EntryStateChange.findAll({
    where: {
      toState: ENTRY_STATES.PENDING,
      createdAt: { [Op.lte]: fourWeeksAgo },
    },
  })

  if (oldPendingChanges.length === 0) {
    return []
  }

  const entryIds = oldPendingChanges.map(sc => sc.entryId)

  return Entry.findAll({
    where: {
      id: { [Op.in]: entryIds },
      state: ENTRY_STATES.EXPERT_GROUP,
    },
  })
}

export const runExpertGroupCheck = async (): Promise<void> => {
  const entries = await getExpertGroupEntries()

  if (entries.length === 0) {
    logger.info('stateMonitor: no entries in EXPERT_GROUP that entered PENDING 4+ weeks ago')
    return
  }

  const lines = entries.map(formatEntryLine).join('')
  const subject = 'Risk-i: käsittelemättömiä riskiarvioita'
  const text = `<p>Seuraavien riskiarvioiden käsittely on kestänyt jo yli neljä viikkoa:</p><ul>${lines}</ul>`

  logger.info(`stateMonitor: sending EXPERT_GROUP alert for ${entries.length} entries`)
  await sendEmail(RECIPIENTS, text, subject)
}

export const runCombinedReport = async (): Promise<void> => {
  const [pendingEntries, expertEntries] = await Promise.all([getPendingEntries(), getExpertGroupEntries()])

  if (pendingEntries.length === 0 && expertEntries.length === 0) {
    logger.info('stateMonitor: no entries found for combined report')
    return
  }

  const sections: string[] = []

  if (pendingEntries.length > 0) {
    const pendingLines = pendingEntries.map(formatEntryLine).join('')
    sections.push(`<p>Seuraavien riskiarvioiden luomisesta on kulunut yli kaksi viikkoa:</p><ul>${pendingLines}</ul>`)
  }

  if (expertEntries.length > 0) {
    const expertLines = expertEntries.map(formatEntryLine).join('')
    sections.push(`<p>Seuraavien riskiarvioiden käsittely on kestänyt jo yli neljä viikkoa:</p><ul>${expertLines}</ul>`)
  }

  const subject = 'Risk-i: käsittelemättömiä riskiarvioita'
  const text = sections.join('')

  logger.info(
    `stateMonitor: sending combined report (pending=${pendingEntries.length}, expertGroup=${expertEntries.length})`
  )
  await sendEmail(RECIPIENTS, text, subject)
}

export const run = async (): Promise<void> => {
  if (isFirstMondayOfMonth()) {
    logger.info('stateMonitor: first Monday of month — sending combined weekly/monthly report')
    await runCombinedReport()
    return
  }

  logger.info('stateMonitor: running weekly PENDING check')
  await runPendingCheck()
}

const startStateMonitorCron = (): void => {
  // Every Monday at 08:00 Helsinki time
  const cronTime = '0 8 * * 1'
  logger.info('stateMonitor cron job scheduled')
  scheduleCronJob(cronTime, run)
}

export default startStateMonitorCron
