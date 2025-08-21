import { DEFAULT_SURVEY_NAME } from '@config'

const getSurveyData = () => ({
  id: 1,
  name: DEFAULT_SURVEY_NAME,
  title: {
    fi: '## Tervetuloa Risk-i:n',
    sv: '## Välkommen till Risk-i',
    en: '## Welcome to Risk-i',
  },
  text: {
    fi: '### Tervetuloa käyttämään Helsingin yliopiston kansainvälisen yhteistyön riskiarviointisovellusta. Täyttämällä arvioitavan yhteistyön perustiedot, saat arvion sekä yhteistyön kokonaisriskitasosta että keskeisten kv-yhteistyön yksittäisistä riskeistä. Lisäksi saat ohjeita ja lisätietoja tunnistettujen riskien hallitsemiseksi.  Sovelluksen on tarkoitettu tutkimus-, opetus- ja liikkuvuusyhteistyön arvioimiseen, ja sen käyttäminen muihin tarkoituksiin ei ole suotavaa. Sovellukseen liittyviä kommentteja ja kysymyksiä voit lähettää: grp-int-risks@helsinki.fi',
    sv: '',
    en: '### Welcome to the University of Helsinki international collaboration risk assessment application. By providing some key data regarding the collaboration, you will receive an assessment of the overall risk level, as well as for related individual risks. Additionally, you will receive instructions and additional information on how to manage and mitigate these risks. The application in intended for assessing risks in research, education and mobility -related collaboration, and it is not recommended to use it for different purposes. You may send comments and questions regarding the use of the application to grp-int-risks@helsinki.fi',
  },
})

export default getSurveyData
