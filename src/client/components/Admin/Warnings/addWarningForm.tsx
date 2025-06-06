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
    //console.log("Klaks")

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
    //console.log(res)
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
      <p>OK</p>
      <form onSubmit={addWarning}>
        Maa: <input value={newCountry} onChange={handleCountryChange} placeholder="Country name in english" />
        Varoitus suomeksi: <input value={newFiText} onChange={handleFiTextChange} placeholder="uusi käännös" />
        Varoitus englanniski: <input value={newEnText} onChange={handleEnTextChange} placeholder="new translation" />
        Päättymispäivä: <input value={newExpiryDate} onChange={handleExpiryDateChange} placeholder="new date" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default WarningForm
