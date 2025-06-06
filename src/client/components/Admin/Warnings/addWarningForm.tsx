import { useState } from 'react'

//import { useQueryClient } from 'react-query'
import { createWarning } from 'src/client/hooks/useWarnings'

import useCountries from '../../../hooks/useCountries'

const WarningForm = () => {
  //const queryClient = useQueryClient()

  const { countries } = useCountries()

  const [newCountry, setNewCountry] = useState('')
  const [newFiText, setNewFiText] = useState('')
  const [newEnText, setNewEnText] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const addWarning = async event => {
    event.preventDefault()

    if (!countries) return null
    const countryCode = countries.find(country => country.name === newCountry)?.iso2Code
    if (!countryCode) return null

    const warningObject = {
      id: Math.floor(Math.random() * 100),
      country: countryCode,
      text: {
        fi: newFiText,
        en: newEnText,
      },
      expiry_date: newExpiryDate,
    }
    const res = await createWarning(warningObject)
    setNewCountry('')
    setNewFiText('')
    setNewEnText('')
    setNewExpiryDate('')
    return res
  }

  const handleCountryChange = event => {
    setNewCountry(event.target.value)
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

  return (
    <div>
      <form onSubmit={addWarning}>
        <div>
          Maa: <input value={newCountry} onChange={handleCountryChange} placeholder="Country name in english" />
        </div>
        <div>
          Varoitus suomeksi: <input value={newFiText} onChange={handleFiTextChange} placeholder="uusi käännös" />
        </div>
        <div>
          Varoitus englanniksi: <input value={newEnText} onChange={handleEnTextChange} placeholder="new translation" />
        </div>
        <div>
          Päättymispäivä: <input value={newExpiryDate} onChange={handleExpiryDateChange} placeholder="new date" />
        </div>
        <button type="submit" style={{ color: '#0288d1', width: '10%', borderColor: '#0288d1' }}>
          Send
        </button>
      </form>
    </div>
  )
}

export default WarningForm
