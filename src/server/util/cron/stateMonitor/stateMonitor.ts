import { Entry, EntryStateChange } from '@dbmodels'
import { Op } from 'sequelize'

import { ENTRY_STATES } from '@common/entryStates'
import logger from '../../logger'
import scheduleCronJob from '../schedule'
import sendEmail from '../../mailer'

const RECIPIENT = 'matti.luukkainen@helsinki.fi'
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

const runPendingCheck = async (): Promise<void> => {
  const twoWeeksAgo = weeksAgo(0)

  const staleStateChanges = await EntryStateChange.findAll({
    where: {
      toState: ENTRY_STATES.PENDING,
      createdAt: { [Op.lte]: twoWeeksAgo },
    },
  })

  if (staleStateChanges.length === 0) {
    logger.info('stateMonitor: no stale PENDING entries found')
    return
  }

  const entryIds = staleStateChanges.map(sc => sc.entryId)

  const entries = await Entry.findAll({
    where: {
      id: { [Op.in]: entryIds },
      state: ENTRY_STATES.PENDING,
    },
  })

  if (entries.length === 0) {
    logger.info('stateMonitor: no entries still in PENDING state')
    return
  }

  const lines = entries.map(formatEntryLine).join('')
  const subject = 'Risk-i: käsittelemättömiä riskiarvioita'
  const text = `<p>Seuraavien riskiarvioiden luomisesta on kulunut yli kaksi viikkoa:</p><ul>${lines}</ul>`

  logger.info(`stateMonitor: sending PENDING alert for ${entries.length} entries`)
  await sendEmail([RECIPIENT], text, subject)
}

export const runExpertGroupCheck = async (): Promise<void> => {
  const fourWeeksAgo = weeksAgo(1)

  const oldPendingChanges = await EntryStateChange.findAll({
    where: {
      toState: ENTRY_STATES.PENDING,
      createdAt: { [Op.lte]: fourWeeksAgo },
    },
  })

  if (oldPendingChanges.length === 0) {
    logger.info('stateMonitor: no entries entered PENDING 4+ weeks ago')
    return
  }

  const entryIds = oldPendingChanges.map(sc => sc.entryId)

  const entries = await Entry.findAll({
    where: {
      id: { [Op.in]: entryIds },
      state: ENTRY_STATES.EXPERT_GROUP,
    },
  })

  if (entries.length === 0) {
    logger.info('stateMonitor: no entries in EXPERT_GROUP that entered PENDING 4+ weeks ago')
    return
  }

  const lines = entries.map(formatEntryLine).join('')
  const subject = 'Risk-i: jo yli neljä viikkoa kestäneitä riskiarvion käsittelyjä'
  const text = `<p>Seuraavien riskiarvioiden käsittely on kestänyt jo yli neljä viikkoa:</p><ul>${lines}</ul>`

  logger.info(`stateMonitor: sending EXPERT_GROUP alert for ${entries.length} entries`)
  await sendEmail([RECIPIENT], text, subject)
}

export const run = async (): Promise<void> => {
  logger.info('stateMonitor: running weekly PENDING check')
  await runPendingCheck()

  if (isFirstMondayOfMonth()) {
    logger.info('stateMonitor: first Monday of month — running EXPERT_GROUP check')
    await runExpertGroupCheck()
  }
}

const startStateMonitorCron = (): void => {
  // Every Monday at 08:00 Helsinki time
  const cronTime = '0 8 * * 1'
  logger.info('stateMonitor cron job scheduled')
  scheduleCronJob(cronTime, run)
}

export default startStateMonitorCron
