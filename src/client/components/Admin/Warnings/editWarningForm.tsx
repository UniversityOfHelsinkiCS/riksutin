import { useState } from 'react'

import { useEditWarning } from 'src/client/hooks/useWarnings'
import useCountries from '../../../hooks/useCountries'

import { Autocomplete, TextField } from '@mui/material'

const EditWarningForm = ({ countryName, text, expiryDate, id }) => {
  const { countries } = useCountries()
  const { mutate: editWarning } = useEditWarning()

  const [newCountry, setNewCountry] = useState(countryName)
  const [newFiText, setNewFiText] = useState(text.fi)
  const [newEnText, setNewEnText] = useState(text.en)
  const [newExpiryDate, setNewExpiryDate] = useState(expiryDate)

  const [showEditWarningForm, setShowEditWarningForm] = useState(false)

  const addEditedWarning = event => {
    event.preventDefault()

    if (!countries) return null
    const countryCode = countries.find(country => country.name === newCountry)?.iso2Code
    if (!countryCode) return null

    const warningObject = {
      id,
      country: countryCode,
      text: {
        fi: newFiText,
        en: newEnText,
      },
      expiry_date: newExpiryDate,
      updatedAt: '',
      createdAt: '',
    }

    setShowEditWarningForm(false)

    return editWarning(warningObject)
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
  if (!countryNames) return null

  return (
    <div>
      <button
        onClick={handleEdit}
        style={{
          padding: '3px',
          width: '10%',
          color: '#3d8f29',
          borderColor: '#53ab3e',
          margin: '10px',
          borderStyle: 'solid',
          borderRadius: '5px',
        }}
      >
        Edit
      </button>

      {showEditWarningForm && (
        <form onSubmit={addEditedWarning} style={{ backgroundColor: '#dae3f2', padding: '20px', margin: '10px' }}>
          <div>
            Maa:
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
            Varoitus suomeksi:{' '}
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
            Varoitus englanniksi:{' '}
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
            Päättymispäivä: <input value={newExpiryDate} onChange={handleExpiryDateChange} placeholder="new date" />
          </div>
          <button
            type="submit"
            style={{
              padding: '3px',
              width: '10%',
              color: '#107eab',
              borderColor: '#87bed5',
              borderStyle: 'solid',
              borderRadius: '5px',
            }}
          >
            Send
          </button>
        </form>
      )}
    </div>
  )
}

export default EditWarningForm
