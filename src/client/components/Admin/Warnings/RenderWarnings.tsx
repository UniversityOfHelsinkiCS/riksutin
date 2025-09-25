import { useWarnings } from 'src/client/hooks/useWarnings'
import useCountries from 'src/client/hooks/useCountries'
import { useTranslation } from 'react-i18next'
import { useDeleteWarning } from 'src/client/hooks/useWarnings'
import EditWarningForm from './editWarningForm'
import Markdown from '../../Common/Markdown'

const FormatedDate = ({ expiryDate }) => {
  const date = new Date(expiryDate)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return <>{expiryDate && ` ${day}/${month}/${year}`}</>
}

const WarningObject = ({ country, text, expiryDate, id, updatedAt, createdAt, setNewErrorText, setNewInfoText }) => {
  const { countries } = useCountries()
  const { warnings } = useWarnings()
  const { mutate: deleteWarning } = useDeleteWarning()
  const { t } = useTranslation()

  if (!countries) {
    return null
  }

  const countryObj = countries.find(countryObj => countryObj.iso2Code == country)

  if (!countryObj) {
    return null
  }

  if (!warnings) {
    return null
  }

  const handleDelete = event => {
    event.preventDefault()
    // eslint-disable-next-line
    if (window.confirm(`Are you sure you want to delete a warning for ${country}`)) {
      const countryId = warnings.find(warnObj => warnObj.country === country)?.id

      if (countryId) {
        void deleteWarning(String(countryId))
        setNewInfoText('Poisto onnistui')
        setTimeout(() => {
          setNewInfoText('')
        }, 5000)
      } else {
        setNewErrorText('Poisto ei onnistunut')
        setTimeout(() => {
          setNewErrorText('')
        }, 5000)
      }
    }
  }

  return (
    <div
      style={{
        borderStyle: 'solid',
        borderColor: '#dae3f2',
        borderWidth: '0px',
        borderBottomWidth: '6px',
        borderTopWidth: '2px',
        borderLeftWidth: '3px',
        padding: '20px',
        margin: '10px',
        borderRadius: '5px',
      }}
    >
      <h4>{countryObj?.name}:</h4>

      <ul>
        <ul>
          <Markdown>{`FI: ${text.fi}`}</Markdown>
        </ul>
        <p></p>
        <ul>
          <Markdown>{`EN: ${text.en}`}</Markdown>
        </ul>
        <p>
          {`${t('admin:expire')}:`} {expiryDate && <FormatedDate expiryDate={expiryDate} />}
        </p>
        <p>
          {`${t('admin:updated')}:`} {updatedAt && <FormatedDate expiryDate={updatedAt} />}
        </p>
        <p>
          {`${t('admin:created')}:`} {updatedAt && <FormatedDate expiryDate={createdAt} />}
        </p>

        <EditWarningForm
          countryName={countryObj.name}
          text={text}
          expiryDate={expiryDate}
          id={id}
          createdAt={createdAt}
          setNewErrorText={setNewErrorText}
          setNewInfoText={setNewInfoText}
        />
        <button
          onClick={handleDelete}
          style={{
            padding: '3px',
            width: '80px',
            color: '#ab4141',
            borderColor: '#c25353',
            margin: '10px',
            borderStyle: 'solid',
            borderRadius: '5px',
          }}
        >
          {t('admin:delete')}
        </button>
      </ul>
    </div>
  )
}

const RenderWarnings = ({ setNewErrorText, setNewInfoText }) => {
  const { t } = useTranslation()
  const { warnings } = useWarnings()

  if (!warnings) {
    return null
  }

  warnings.sort(function (a, b) {
    const x = a.country.toLowerCase()
    const y = b.country.toLowerCase()
    if (x < y) {
      return -1
    }
    if (x > y) {
      return 1
    }
    return 0
  })

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
            setNewErrorText={setNewErrorText}
            setNewInfoText={setNewInfoText}
          />{' '}
        </ul>
      ))}
    </div>
  )
}

export default RenderWarnings
