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
  return `  - ${projectName}: ${entryLink(entry.id)}`
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

  const lines = entries.map(formatEntryLine).join('\n')
  const subject = 'Risk-i: Entries stuck in PENDING state for 2+ weeks'
  const text = `The following entries have been in PENDING state for at least 2 weeks:\n\n${lines}\n`

  logger.info(`stateMonitor: sending PENDING alert for ${entries.length} entries`)
  await sendEmail([RECIPIENT], text, subject)
}

const runExpertGroupCheck = async (): Promise<void> => {
  const fourWeeksAgo = weeksAgo(2)

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

  const lines = entries.map(formatEntryLine).join('\n')
  const subject = 'Risk-i: Entries in EXPERT_GROUP state — entered PENDING 4+ weeks ago'
  const text = `The following entries entered PENDING state more than 4 weeks ago and are currently in EXPERT_GROUP state:\n\n${lines}\n`

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
