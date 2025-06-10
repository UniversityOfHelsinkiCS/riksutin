import { useWarnings } from 'src/client/hooks/useWarnings'
import useCountries from 'src/client/hooks/useCountries'
import { useTranslation } from 'react-i18next'
import { useDeleteWarning } from 'src/client/hooks/useWarnings'
import EditWarningForm from './editWarningForm'

const FormatedDate = ({ expiryDate }) => {
  //const { t } = useTranslation()
  const date = new Date(expiryDate)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  //return <p>{expiryDate && `${t('admin:expire')}: ${year}-${month}-${day}`}</p>
  return <p>{expiryDate && ` ${year}-${month}-${day}`}</p>
}

const WarningObject = ({ country, text, expiryDate, id, updatedAt, createdAt }) => {
  const { countries } = useCountries()
  const { warnings } = useWarnings()
  const { mutate: deleteWarning } = useDeleteWarning()
  const { t } = useTranslation()

  if (!countries) return null

  const countryObj = countries.find(countryObj => countryObj.iso2Code == country)

  if (!countryObj) return null

  if (!warnings) return null

  const handleDelete = event => {
    event.preventDefault()
    // eslint-disable-next-line
    if (window.confirm(`Are you sure you want to delete a warning for ${country}`)) {
      const countryId = warnings.find(warnObj => warnObj.country === country)?.id

      if (countryId) {
        void deleteWarning(String(countryId))
      }
    }
  }

  return (
    <div>
      <h4>{countryObj?.name}:</h4>
      <ul>
        <ul>{text.fi}</ul>
        <p></p>
        <ul>{text.en}</ul>
        {`${t('admin:expire')}:`} {expiryDate && <FormatedDate expiryDate={expiryDate} />}
        päivitetty: {updatedAt && <FormatedDate expiryDate={updatedAt} />}
        luotu: {updatedAt && <FormatedDate expiryDate={createdAt} />}
        <button
          onClick={handleDelete}
          style={{
            padding: '3px',
            width: '10%',
            color: '#ab4141',
            borderColor: '#c25353',
            margin: '10px',
            borderStyle: 'solid',
            borderRadius: '5px',
          }}
        >
          Delete
        </button>
        <EditWarningForm
          countryName={countryObj.name}
          text={text}
          expiryDate={expiryDate}
          id={id}
          createdAt={createdAt}
        />
      </ul>
    </div>
  )
}

const RenderWarnings = () => {
  const { t } = useTranslation()
  const { warnings } = useWarnings()

  if (!warnings) return null

  return (
    <div>
      <h4>{t('admin:allCountryWarnings')}</h4>
      <p></p>
      {warnings.map(c => (
        <ul key={c.country}>
          {' '}
          <WarningObject
            country={c.country}
            text={c.text}
            expiryDate={c.expiry_date}
            id={c.id}
            updatedAt={c.updatedAt}
            createdAt={c.createdAt}
          />{' '}
        </ul>
      ))}
    </div>
  )
}

export default RenderWarnings
