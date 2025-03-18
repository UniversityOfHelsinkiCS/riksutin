import apiClient from './apiClient'

const sendEmail = async (targets: string[], entryId: string) => {
  if (!targets || targets.length === 0) throw Error('Could not send emails')

  await apiClient.post(`/entries/${entryId}/send-email`, {
    targets,
  })
}

export default sendEmail
