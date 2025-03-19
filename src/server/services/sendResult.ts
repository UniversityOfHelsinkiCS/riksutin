import { Entry } from '@dbmodels'
import { createPdfResultBuffer } from './pdfResult'
import i18n from '../util/i18n'
import sendEmail from '@userservices/mailer'
import logger from '../util/logger'
import { inDevelopment } from '@config'
import fs from 'fs'

export const sendResult = async (entry: Entry, targets: string[]) => {
  const pdfBuffer = await createPdfResultBuffer(entry)

  logger.info('Generated PDF for entry', { entryId: entry.id })

  const text = `${i18n.t('email:bodyTitle')}\n${i18n.t('email:bodyText')}`

  const subject = i18n.t('email:subject')

  const filename = 'risk-assessment.pdf'

  // Save to a file in development
  if (inDevelopment) {
    fs.writeFileSync(filename, pdfBuffer)
    logger.info('DEVELOPMENT: Saved PDF to file', { filename })
    return
  }

  await sendEmail(targets, text, subject, {
    filename,
    content: pdfBuffer,
  })
}
