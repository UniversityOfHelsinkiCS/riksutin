import { Entry, User } from '@dbmodels'
import sendEmail from '../util/mailer'
import logger from '../util/logger'

export const notifyControlReportCreated = async (entry: Entry) => {
  const subject = 'Control Report Created / Valvontaraportti luotu'

  const projectName = entry.data.answers[3] || 'your project'

  const text = `A Control Report has been created for your project ${projectName}.
Review it at: risk-i.helsinki.fi/user/${entry.id}

Projektillesi ${projectName} on luotu valvontaraportti.
Tutustu siihen osoitteessa: risk-i.helsinki.fi/user/${entry.id}`

  // Get both creator and owner
  const creator = await User.findByPk(entry.userId)
  const owner = await User.findByPk(entry.ownerId)

  const recipients: string[] = []

  if (creator?.email) {
    recipients.push(creator.email)
  }

  // Add owner if different from creator
  if (owner?.email && owner.id !== creator?.id) {
    recipients.push(owner.email)
  }

  if (recipients.length === 0) {
    logger.warn('No recipients found for control report notification', { entryId: entry.id })
    return
  }

  await sendEmail(recipients, text, subject)
  logger.info('Control report notification sent', { entryId: entry.id, recipients })
}
