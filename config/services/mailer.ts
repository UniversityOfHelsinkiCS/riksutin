import axios from 'axios'

import { inProduction, appName } from '@config'
import { PATE_URL } from '@userconfig'

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

const uploadFile = async (attachment: { filename: string; content: Blob }) => {
  const formData = new FormData()
  formData.append('file', attachment.content, attachment.filename)

  const response = await pateClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data.fileId // Assuming the API returns a fileId
}

const sendEmail = async (
  targets: string[],
  text: string,
  subject: string,
  attachment: { filename: string; content: Blob } | null = null
) => {
  const emails = targets.map(to => ({ to, subject }))

  const attachmentFileId = attachment ? await uploadFile(attachment) : undefined

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
}

export default sendEmail
