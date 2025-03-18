import { Entry } from '@dbmodels'
import { createPdfResultBlob } from './pdfResult'
import i18n from '../util/i18n'
import sendEmail from '@userservices/mailer'
import logger from '../util/logger'
import { inDevelopment } from '@config'
import fs from 'fs'

export const sendResult = async (entry: Entry, targets: string[]) => {
  const pdfBlob = await createPdfResultBlob(entry)

  logger.info('Generated PDF for entry', { entryId: entry.id })

  const text = `${i18n.t('email:bodyTitle')}\n${i18n.t('email:bodyText')}`

  const subject = i18n.t('email:subject')

  const filename = `result-${entry.id}.pdf`

  // Save to a file in development
  if (inDevelopment) {
    const arrayBuffer = await pdfBlob.arrayBuffer()
    fs.writeFileSync(filename, Buffer.from(arrayBuffer))
    logger.info('DEVELOPMENT: Saved PDF to file', { filename })
    return
  }

  await sendEmail(targets, subject, text, {
    filename,
    content: pdfBlob,
  })
}
