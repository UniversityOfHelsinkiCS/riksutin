import axios from 'axios'

import { inProduction, appName } from '@config'
import { PATE_URL } from '@userconfig'
import logger from 'src/server/util/logger'
import FormData from 'form-data'

const settings = {
  hideToska: false,
  disableToska: true,
  color: '#fc7f03',
  header: 'Risk-i.helsinki.fi',
  headerFontColor: 'white',
  dryrun: !inProduction,
}

const pateClient = axios.create({
  baseURL: PATE_URL,
  params: {
    token: process.env.API_TOKEN,
  },
})

const uploadFile = async (attachment: { filename: string; content: Buffer }) => {
  const formData = new FormData()
  formData.append('file', attachment.content, attachment.filename)

  const response = await pateClient.post('/upload', formData, {
    headers: formData.getHeaders(),
  })

  return response.data.fileId // Assuming the API returns a fileId
}

const sendEmail = async (
  targets: string[],
  text: string,
  subject: string,
  attachment: { filename: string; content: Buffer } | null = null
) => {
  const emails = targets.map(to => ({ to, subject }))

  // Log attachment to the console
  if (attachment) logger.info('Sending ' + attachment.filename)

  const attachmentFileId = attachment ? await uploadFile(attachment) : undefined

  // Log attachmentFileId to the console
  if (attachmentFileId) logger.info('Sent ' + attachment?.filename + 'got' + attachmentFileId)

  const mail = {
    template: {
      from: appName,
      text,
    },
    emails,
    settings,
    attachmentFileId,
  }

  await pateClient.post('/', mail)

  logger.info('Email sent')
}

export default sendEmail
