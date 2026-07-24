import type { RiskData } from '@types'

import { Entry, User } from '@dbmodels'
import logger from '../../logger'
import scheduleCronJob from '../schedule'
import createRiskData from '../../algorithm/riskData'
import sendAlertEmail from './sendAlertEmail'

export const riskReEvaluation = async (entry: Entry) => {
  const { answers } = entry.data
  const reCalculatedData = await createRiskData(answers)
  if (!reCalculatedData) {
    return null
  }

  const previousVersionTimestamp = entry.updatedAt?.toISOString() ?? entry.createdAt.toISOString()
  const previousDataSnapshot = {
    answers: entry.data.answers,
    risks: entry.data.risks,
    country: entry.data.country,
    multilateralCountries: entry.data.multilateralCountries,
    createdAt: previousVersionTimestamp,
  }

  const dataWithRecalculatedValues: RiskData = {
    ...entry.data,
    ...reCalculatedData,
    updatedData: !entry.data.updatedData
      ? new Array(previousDataSnapshot)
      : entry.data.updatedData.concat(previousDataSnapshot),
  }

  return dataWithRecalculatedValues
}

const run = async () => {
  logger.info('Recalculating data')
  const entries = await Entry.findAll()
  entries.forEach(async entry => {
    const updatedRisks = await riskReEvaluation(entry)

    if (!updatedRisks) {
      return null
    }

    const originalTotalRiskLevel = entry.data.risks.find(risk => risk.id === 'total')?.level
    const updatedTotalRiskLevel = updatedRisks.risks.find(risk => risk.id === 'total')?.level

    try {
      if (
        originalTotalRiskLevel != null &&
        updatedTotalRiskLevel === 3 &&
        updatedTotalRiskLevel > originalTotalRiskLevel
      ) {
        entry.set('data', updatedRisks)
        entry.changed('data', true)
        const updatedObject = await entry.save()

        const user = await User.findByPk(entry.userId)

        if (user) {
          await sendAlertEmail(user.email, entry.data.answers[3], entry.id.toString())
        }
        return updatedObject
      }
    } catch {
      logger.error('Updating risks failed')
    }

    return null
  })
}

const startRiskCron = () => {
  const cronTime = '0 12 * * 1'
  logger.info('Cron job scheduled')
  return scheduleCronJob(cronTime, run)
}

export default startRiskCron
