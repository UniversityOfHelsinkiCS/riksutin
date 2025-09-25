import { useState } from 'react'

import { useCreateWarning } from 'src/client/hooks/useWarnings'
import useCountries from '../../../hooks/useCountries'

import { Autocomplete, TextField } from '@mui/material'

import { useTranslation } from 'react-i18next'

const WarningForm = ({ showForm, setShowForm, setNewStatusText, setNewErrorText }) => {
  const { countries } = useCountries()
  const { mutateAsync: createWarning } = useCreateWarning()
  const { t } = useTranslation()

  const [newCountry, setNewCountry] = useState('')
  const [newFiText, setNewFiText] = useState('')
  const [newEnText, setNewEnText] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const addWarning = async event => {
    event.preventDefault()

    if (!countries) {
      return null
    }
    const countryCode = countries.find(country => country.name === newCountry)?.iso2Code
    if (!countryCode) {
      return null
    }

    const warningObject = {
      country: countryCode,
      text: {
        fi: newFiText,
        en: newEnText,
      },
      expiry_date: newExpiryDate.length > 0 ? newExpiryDate : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNewCountry('')
    setNewFiText('')
    setNewEnText('')
    setNewExpiryDate('')
    setShowForm(!showForm)

    try {
      const res = await createWarning(warningObject)

      setNewStatusText('luonti onnistui')
      setTimeout(() => {
        setNewStatusText('')
      }, 5000)
      return res
    } catch (er: any) {
      setNewErrorText(' luonti ei onistunut [' + er.message + ']')
      setTimeout(() => {
        setNewErrorText('')
      }, 5000)
    }
    return 'NO data'
  }

  const handleCountryChange = (event, value) => {
    setNewCountry(value)
  }

  const handleFiTextChange = event => {
    setNewFiText(event.target.value)
  }

  const handleEnTextChange = event => {
    setNewEnText(event.target.value)
  }

  const handleExpiryDateChange = event => {
    setNewExpiryDate(event.target.value)
  }

  const countryNames = countries?.map(c => c.name)
  if (!countryNames) {
    return null
  }

  return (
    <div>
      <form
        onSubmit={addWarning}
        style={{ backgroundColor: '#dae3f2', padding: '20px', margin: '10px', borderRadius: '5px' }}
      >
        <div>
          {t('admin:country')}
          <Autocomplete
            style={{ background: 'white', border: '1.5px solid #708287', borderRadius: '3px' }}
            disablePortal
            onChange={handleCountryChange}
            options={countryNames}
            sx={{ width: 300 }}
            renderInput={params => <TextField {...params} label="Countries" />}
          />
        </div>

        <div style={{ margin: '5px' }}>
          {t('admin:WarningInFinnish')}
          <textarea
            value={newFiText}
            onChange={handleFiTextChange}
            placeholder="uusi käännös"
            cols={80}
            rows={5}
            style={{
              display: 'flex',
              margin: '5px',
              border: '1.5px solid #708287',
              borderRadius: '3px',
              padding: '5px',
            }}
          />
        </div>
        <div style={{ margin: '5px' }}>
          {t('admin:WarningInEnglish')}
          <textarea
            value={newEnText}
            onChange={handleEnTextChange}
            placeholder="new translation"
            cols={80}
            rows={5}
            style={{
              display: 'flex',
              margin: '5px',
              border: '1.5px solid #708287',
              borderRadius: '3px',
              padding: '5px',
            }}
          />
        </div>
        <div style={{ margin: '5px' }}>
          <p>{t('admin:ExpiryDate')} (optional)</p>{' '}
          <input
            type="date"
            value={newExpiryDate}
            onChange={handleExpiryDateChange}
            placeholder="new date"
            min="2025-01-01"
            style={{ border: '1.5px solid rgb(73, 126, 141)', borderRadius: '15px', padding: '5px' }}
          />
        </div>

        <button
          onClick={() => setShowForm(false)}
          style={{
            padding: '3px',
            width: '10%',
            color: '#107eab',
            borderColor: '#87bed5',
            borderStyle: 'solid',
            borderRadius: '5px',
            margin: '10px',
          }}
        >
          {t('admin:cancel')}
        </button>

        <button
          type="submit"
          style={{
            padding: '3px',
            width: '10%',
            color: '#33708a',
            borderColor: '#4d88a1',
            borderStyle: 'solid',
            borderRadius: '5px',
          }}
        >
          {t('admin:send')}
        </button>
      </form>
    </div>
  )
}

export default WarningForm
