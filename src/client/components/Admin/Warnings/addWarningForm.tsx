import { useState } from 'react'

import { useCreateWarning } from 'src/client/hooks/useWarnings'
import useCountries from '../../../hooks/useCountries'

import { Autocomplete, TextField } from '@mui/material'
//import { useQueryClient } from 'react-query'

const WarningForm = ({ showForm, setShowForm }) => {
  //const queryClient = useQueryClient()

  const { countries } = useCountries()
  const { mutate: createWarning } = useCreateWarning()

  const [newCountry, setNewCountry] = useState('')
  const [newFiText, setNewFiText] = useState('')
  const [newEnText, setNewEnText] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')
  //const [newStatusText, setNewStatusText ] = useState('(testi-ilmoitus)')

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
      expiry_date: newExpiryDate.length > 0 ? newExpiryDate : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNewCountry('')
    setNewFiText('')
    setNewEnText('')
    setNewExpiryDate('')
    setShowForm(!showForm)

    //try{
    //console.log("ennen virhettä")
    return createWarning(warningObject) //vanha
    //createWarning(warningObject)
    //setNewStatusText("onnistui")
    //} catch (er: unknown) {
    //  console.log("virhe")
    //  console.log("error: ", er)
    //  setNewStatusText("ei onnistunut")
    //  return (er)
    //}
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
  //{newStatusText}
  return (
    <div>
      <form
        onSubmit={addWarning}
        style={{ backgroundColor: '#dae3f2', padding: '20px', margin: '10px', borderRadius: '5px' }}
      >
        <div>
          Country
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
          Warning in Finnish
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
          Warning in English
          <textarea
            value={newEnText}
            onChange={handleEnTextChange}
            placeholder="new translation"
            cols={80}
            rows={5}
            style={{ display: 'flex', justifyContent: 'flexEnd', margin: '5px' }}
          />
        </div>
        <div style={{ margin: '5px' }}>
          <p>Expiry date</p>{' '}
          <input type="date" value={newExpiryDate} onChange={handleExpiryDateChange} placeholder="new date" />
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
          Cancel
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
          Send
        </button>
      </form>
    </div>
  )
}

export default WarningForm
