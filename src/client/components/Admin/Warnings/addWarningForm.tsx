import { useState } from 'react'

import { useCreateWarning } from 'src/client/hooks/useWarnings'
import useCountries from '../../../hooks/useCountries'

import { Autocomplete, TextField } from '@mui/material'
//import { useQueryClient } from 'react-query'

const WarningForm = () => {
  //const queryClient = useQueryClient()

  const { countries } = useCountries()
  const { mutate: createWarning } = useCreateWarning()

  const [newCountry, setNewCountry] = useState('')
  const [newFiText, setNewFiText] = useState('')
  const [newEnText, setNewEnText] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const addWarning = event => {
    event.preventDefault()

    if (!countries) return null
    const countryCode = countries.find(country => country.name === newCountry)?.iso2Code
    if (!countryCode) return null

    const warningObject = {
      country: countryCode,
      text: {
        fi: newFiText,
        en: newEnText,
      },
      expiry_date: newExpiryDate,
    }
    // console.log("id", warningObject.id)

    setNewCountry('')
    setNewFiText('')
    setNewEnText('')
    setNewExpiryDate('')

    return createWarning(warningObject)
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
  if (!countryNames) return null

  //<input value={newCountry} onChange={handleCountryChange} placeholder="Country name in english" />
  return (
    <div>
      <form onSubmit={addWarning} style={{ backgroundColor: '#dae3f2', padding: '20px', margin: '10px' }}>
        <div>
          Maa:
          <Autocomplete
            style={{ background: 'white' }}
            disablePortal
            //value={newCountry}
            onChange={handleCountryChange}
            options={countryNames}
            sx={{ width: 300 }}
            renderInput={params => <TextField {...params} label="Countries" />}
          />
        </div>

        <div style={{ margin: '5px' }}>
          Varoitus suomeksi
          <textarea
            value={newFiText}
            onChange={handleFiTextChange}
            placeholder="uusi käännös"
            cols={80}
            rows={5}
            style={{ display: 'flex', justifyContent: 'flexEnd', margin: '5px' }}
          />
        </div>
        <div style={{ margin: '5px' }}>
          Varoitus englanniksi
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
          Päättymispäivä{' '}
          <input type="date" value={newExpiryDate} onChange={handleExpiryDateChange} placeholder="new date" />
        </div>
        <button
          type="submit"
          style={{
            width: '10%',
            color: '#107eab',
            borderColor: '#87bed5',
            borderStyle: 'solid',
            borderRadius: '5px',
            padding: '3px',
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default WarningForm
