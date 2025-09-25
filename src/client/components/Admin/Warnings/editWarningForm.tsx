import { useState } from 'react'

import { useEditWarning } from 'src/client/hooks/useWarnings'
import useCountries from '../../../hooks/useCountries'

import { Autocomplete, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

const EditWarningForm = ({ countryName, text, expiryDate, id, createdAt, setNewInfoText, setNewErrorText }) => {
  const { countries } = useCountries()
  const { mutateAsync: editWarning } = useEditWarning()

  const [newCountry, setNewCountry] = useState(countryName)
  const [newFiText, setNewFiText] = useState(text.fi)
  const [newEnText, setNewEnText] = useState(text.en)
  const [newExpiryDate, setNewExpiryDate] = useState(expiryDate)

  const [showEditWarningForm, setShowEditWarningForm] = useState(false)
  const { t } = useTranslation()

  const addEditedWarning = async event => {
    event.preventDefault()

    if (!countries) {
      return null
    }
    const countryCode = countries.find(country => country.name === newCountry)?.iso2Code
    if (!countryCode) {
      return null
    }

    const warningObject = {
      id,
      country: countryCode,
      text: {
        fi: newFiText,
        en: newEnText,
      },
      expiry_date: newExpiryDate,
      updatedAt: String(new Date()),
      createdAt,
    }

    try {
      const res = await editWarning(warningObject)

      setShowEditWarningForm(false)
      setNewInfoText('Editointi onnistui')
      setTimeout(() => {
        setNewInfoText('')
      }, 5000)

      return res
    } catch (error: any) {
      setNewErrorText(' editointi ei onistunut [' + error.message + ']')
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

  const handleEdit = event => {
    event.preventDefault()
    setShowEditWarningForm(!showEditWarningForm)
  }

  const countryNames = countries?.map(c => c.name)
  if (!countryNames) {
    return null
  }

  return (
    <div>
      <button
        onClick={handleEdit}
        style={{
          padding: '3px',
          width: '80px',
          color: '#3d8f29',
          borderColor: '#53ab3e',
          margin: '10px',
          borderStyle: 'solid',
          borderRadius: '5px',
        }}
      >
        {t('admin:edit')}
      </button>

      {showEditWarningForm && (
        <div>
          <h4>Edit warning data</h4>
          <form onSubmit={addEditedWarning} style={{ backgroundColor: '#dae3f2', padding: '20px', margin: '10px' }}>
            <div>
              {t('admin:country')}
              <Autocomplete
                style={{ background: 'white' }}
                disablePortal
                value={newCountry}
                onChange={handleCountryChange}
                options={countryNames}
                sx={{ width: 300 }}
                renderInput={params => <TextField {...params} label="Countries" />}
              />
            </div>
            <div>
              {t('admin:WarningInFinnish')}{' '}
              <textarea
                value={newFiText}
                onChange={handleFiTextChange}
                placeholder="uusi käännös"
                cols={80}
                rows={5}
                style={{ display: 'flex', justifyContent: 'flexEnd', margin: '5px' }}
              />
            </div>
            <div>
              {t('admin:WarningInEnglish')}{' '}
              <textarea
                value={newEnText}
                onChange={handleEnTextChange}
                placeholder="new translation"
                cols={80}
                rows={5}
                style={{ display: 'flex', justifyContent: 'flexEnd', margin: '5px' }}
              />
            </div>
            <div>
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
              type="submit"
              style={{
                padding: '3px',
                width: '70px',
                color: '#33708a',
                borderColor: '#4d88a1',
                borderStyle: 'solid',
                borderRadius: '5px',
              }}
            >
              {t('admin:send')}
            </button>
            <button
              onClick={handleEdit}
              style={{
                padding: '3px',
                width: '70px',
                color: '#107eab',
                borderColor: '#87bed5',
                borderStyle: 'solid',
                borderRadius: '5px',
                margin: '10px',
              }}
            >
              {t('admin:cancel')}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default EditWarningForm
