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

const sendEmail = async (targets: string[], text: string, subject: string) => {
  const emails = targets.map(to => ({ to, subject }))

  const mail = {
    template: {
      from: appName,
      text,
    },
    emails,
    settings,
  }

  await pateClient.post('/', mail)
}

export default sendEmail
