import sendEmail from '../../../util/mailer'

const sendAlertEmail = async (email: string, projectName: string, projectId: string) => {
  const subject = 'UPDATE: Riskitason muuttuminen/Risk level change'
  const text = `Olet käyttänyt yliopiston kansainvälisen toiminnan riskiarvioinnin työkalua hankkeeseen ${projectName}. Arvioinnin laatimisen jälkeen olosuhteet ovat muuttuneet ja hankkeen riskitaso on kohonnut merkittäväksi. Tutustu päivitettyyn riskiarvioon: risk-i.helsinki.fi/user/${projectId} \n\n
  You have used the University risk assessment tool for internationalisation for your project ${projectName}.  Since the initial assessment, circumstances have changed, and the risk assessment level has increased substantially. Please review the updated risk assessment: risk-i.helsinki.fi/user/${projectId}`

  await sendEmail([email], text, subject)
}

export default sendAlertEmail
