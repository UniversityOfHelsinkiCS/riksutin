import axios, { AxiosError } from 'axios'

import { inProduction, appName } from '@config'
import { PATE_URL, TESTER_EMAILS } from '@userconfig'
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

  try {
    const response = await pateClient.post('/upload', formData, {
      headers: formData.getHeaders(),
    })

    return response.data.fileId // Assuming the API returns a fileId
  } catch (error) {
    // If the request failed with 4xx, there is an error message in the returned json body
    if (error instanceof AxiosError && error.response && error.response.status >= 400 && error.response.status < 500) {
      logger.error('Failed to upload file' + error.response.data)
    } else {
      logger.error('Failed to upload file', error)
    }

    throw error
  }
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

  // Check if the email is being sent to a tester. If so, set dryrun to false
  const acuallySendInTesting = TESTER_EMAILS.some(email => emails.some(({ to }) => to === email))

  const mail = {
    template: {
      from: appName,
      text,
    },
    emails,
    settings: { ...settings, dryrun: !acuallySendInTesting },
    attachmentFileId,
  }

  await pateClient.post('/', mail)

  logger.info('Email sent')
}

export default sendEmail
