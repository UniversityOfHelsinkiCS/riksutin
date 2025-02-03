import React from 'react'

import type { Locales } from '@types'

const SummaryEmailTemplate = ({ language }: { language: keyof Locales }) => {
  if (language === 'en') {
    return (
      <div>
        <p>Hello</p>

        <p>
          You have completed an international collaboration risk assessment, and
          the results are available below this message. You may make use of the
          results in any way necessary. Pleas note that you may renew the
          assessment, if there are material changes in your collaboration. You
          will also get an update, should conditions change significantly. If
          necessary, please contact risk-i@helsinki.
        </p>

        <p>**********</p>
        <br />
      </div>
    )
  }

  return (
    <div>
      <p>Hei</p>

      <p>
        Olet täyttänyt kansainvälisen yhteistyön riskiarviolomakkeen ja alla on
        arvioinnin tulokset, joita voit hyödyntää haluamallasi tavalla.
        Huomioithan, että voit päivittää itse riskiarvioinnin, jos hankkeessasi
        tapahtuu olennaisia muutoksia. Saat myös automaattisesti päivityksen,
        jos olosuhteissa tapahtuu merkittäviä muutoksia. Ole tarvittaessa
        yhteydessä risk-i@helsinki.fi.
      </p>

      <p>**********</p>
      <br />
    </div>
  )
}

export default SummaryEmailTemplate
