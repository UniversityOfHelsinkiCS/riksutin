import useWarnings from 'src/client/hooks/useWarnings'
import useCountries from 'src/client/hooks/useCountries'
import { useTranslation } from 'react-i18next'

const WarningObject = ({ country, text }) => {
  const { countries } = useCountries()
  if (!countries) return null

  const countryObj = countries.find(countryObj => countryObj.iso2Code == country)
  //console.log("maan nimi: " + countryObj?.name)

  if (!countryObj) {
    //console.log("ei loytynbyt")
  } else {
    //console.log(countryObj)
  }

  return (
    <div>
      <h4>{countryObj?.name}:</h4>
      <ul>{text.fi}</ul>

      <ul>{text.en}</ul>
    </div>
  )
}

const RenderWarnings = () => {
  const { warnings } = useWarnings()
  const { t } = useTranslation()

  //console.log(t('results:riskTableTitle'))

  if (!warnings) return null

  return (
    <div>
      <h4>{t('admin:allCountryWarnings')}</h4>
      <p></p>
      {warnings.map(({ country, text }) => (
        <ul key={country}>
          {' '}
          <WarningObject country={country} text={text} />{' '}
        </ul>
      ))}
    </div>
  )
}

export default RenderWarnings
