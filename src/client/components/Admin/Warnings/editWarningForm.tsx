import { useState } from 'react'

import { useEditWarning } from 'src/client/hooks/useWarnings'
import useCountries from '../../../hooks/useCountries'

const EditWarningForm = ({ countryName, text, expiryDate, id }) => {
  const { countries } = useCountries()
  const { mutate: editWarning } = useEditWarning()

  const [newCountry, setNewCountry] = useState(countryName)
  const [newFiText, setNewFiText] = useState(text.fi)
  const [newEnText, setNewEnText] = useState(text.en)
  const [newExpiryDate, setNewExpiryDate] = useState(expiryDate)

  const addWarning = event => {
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

    setNewCountry('')
    setNewFiText('')
    setNewEnText('')
    setNewExpiryDate('')

    return editWarning(warningObject)
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
    </div>
  )
}

export default EditWarningForm
