import { useWarnings } from 'src/client/hooks/useWarnings'
import useCountries from 'src/client/hooks/useCountries'
//import useWarnings from 'src/client/hooks/useWarnings'
import { useTranslation } from 'react-i18next'
import { deleteWarning } from 'src/client/hooks/useWarnings'
//import { Warning } from '@dbmodels'

const FormatedDate = ({ expiryDate }) => {
  const { t } = useTranslation()
  const date = new Date(expiryDate)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return <p>{expiryDate && `${t('admin:expire')}: ${year}-${month}-${day}`}</p>
}

const WarningObject = ({ country, text, expiryDate }) => {
  const { countries } = useCountries()
  const { warnings } = useWarnings()
  if (!countries) return null

  const countryObj = countries.find(countryObj => countryObj.iso2Code == country)

  if (!countryObj) return null
  if (!warnings) return null

  const handleDelete = async event => {
    event.preventDefault()
    //console.log("Kluks")

    const countryId = warnings.find(warnObj => warnObj.country === country)?.id

    if (countryId) {
      //console.log(countryId)
      //const res = await deleteWarning(countryId)
      await deleteWarning(countryId)
    }
  }

  return (
    <div>
      <h4>{countryObj?.name}:</h4>
      <ul>
        <ul>{text.fi}</ul>
        <p></p>
        <ul>{text.en}</ul>
        {expiryDate && <FormatedDate expiryDate={expiryDate} />}
        <button style={{ color: 'green' }}>Edit</button>
        <button onClick={handleDelete} style={{ color: 'red' }}>
          Delete
        </button>
      </ul>
    </div>
  )
}

const RenderWarnings = () => {
  const { warnings } = useWarnings()
  const { t } = useTranslation()

  if (!warnings) return null

  return (
    <div>
      <h4>{t('admin:allCountryWarnings')}</h4>
      <p></p>
      {warnings.map(c => (
        <ul key={c.country}>
          {' '}
          <WarningObject country={c.country} text={c.text} expiryDate={c.expiry_date} />{' '}
        </ul>
      ))}
    </div>
  )
}

export default RenderWarnings
