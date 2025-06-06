import { useWarnings } from 'src/client/hooks/useWarnings'
import useCountries from 'src/client/hooks/useCountries'
import { useTranslation } from 'react-i18next'
import { deleteWarning } from 'src/client/hooks/useWarnings'

//import { useComponents } from '@resultRenderer/context'
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
  //const { Div, Markdown, t }  =useComponents()
  if (!countries) return null

  const countryObj = countries.find(countryObj => countryObj.iso2Code == country)

  if (!countryObj) return null
  if (!warnings) return null

  const handleDelete = async event => {
    event.preventDefault()

    const countryId = warnings.find(warnObj => warnObj.country === country)?.id

    if (countryId) {
      await deleteWarning(countryId)
    }
  }
  //<ul><Markdown>{text.fi}</Markdown></ul>

  return (
    <div>
      <h4>{countryObj?.name}:</h4>
      <ul>
        <ul>{text.fi}</ul>
        <p></p>
        <ul>{text.en}</ul>
        {expiryDate && <FormatedDate expiryDate={expiryDate} />}
        <button style={{ color: 'green', width: '10%', borderColor: 'green', margin: '10px' }}>Edit</button>
        <button onClick={handleDelete} style={{ color: 'red', width: '10%', borderColor: 'red', margin: '10px' }}>
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
