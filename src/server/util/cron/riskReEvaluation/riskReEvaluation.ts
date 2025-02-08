import type { RiskData } from '@types'

import { Entry, User } from '@dbmodels'
import logger from '../../logger'
import scheduleCronJob from '../schedule'
import createRiskData from '../../algorithm/createRiskData'
import sendAlertEmail from './sendAlertEmail'

export const riskReEvaluation = async (entry: Entry) => {
  const answers = entry?.data.answers
  if (!answers || !entry) return null

  const reCalculatedData = await createRiskData(answers)
  if (!reCalculatedData) return null

  const reCalculatedDataObject = {
    createdAt: new Date().toISOString(),
    ...reCalculatedData,
  }

  const dataWithRecalculatedValues: RiskData = {
    ...entry.data,
    updatedData: !entry.data.updatedData
      ? new Array(reCalculatedDataObject)
      : entry.data.updatedData.concat(reCalculatedDataObject),
  }

  return dataWithRecalculatedValues
}

const run = async () => {
  logger.info('Recalculating data')
  const entries = await Entry.findAll()
  entries.forEach(async (entry) => {
    const updatedRisks = await riskReEvaluation(entry)

    if (!updatedRisks) return null

    const updatedTotalRiskLevel = updatedRisks.risks.find(
      (risk) => risk.id === 'total'
    )?.level

    try {
      if (
        updatedTotalRiskLevel === 3 &&
        updatedTotalRiskLevel >
          entry.data.risks.find((risk) => risk.id === 'total')?.level
      ) {
        await entry.update({
          data: updatedRisks,
        })

        const updatedObject = await entry.save({ fields: ['data'] })

        const user = await User.findByPk(entry.userId)

        if (user) {
          await sendAlertEmail(
            user.email,
            entry.data.answers[3],
            entry.id.toString()
          )
        }
        return updatedObject
      }
    } catch {
      logger.error('Updating risks failed')
    }

    return null
  })
}

const startRiskCron = async () => {
  const cronTime = '0 12 * * 1'
  logger.info('Cron job scheduled')
  return scheduleCronJob(cronTime, run)
}

export default startRiskCron
