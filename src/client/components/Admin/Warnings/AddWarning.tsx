import { useState } from 'react'

//import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
//import { createWarning } from 'src/client/hooks/useWarnings'

const WarningForm = () => {
  const [newCountry, setNewCountry] = useState('')
  const [newFiText, setNewFiText] = useState('')
  const [newEnText, setNewEnText] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const addWarning = async event => {
    await event.preventDefault()
    //await console.log("Klaks")
    //const warningObject = {
    //    id: Math.random() * 100,
    //    country: newCountry,
    //    text: {
    //        fi: newFiText,
    //        en: newEnText
    //    },
    //    expiry_date: newExpiryDate
    //}
    //const res = createWarning(warningObject)
    //console.log(res)
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
        Maa: <input value={newCountry} onChange={handleCountryChange} placeholder="maa" />
        Varoitus suomeksi: <input value={newFiText} onChange={handleFiTextChange} placeholder="uusi käännös" />
        Varoitus englanniski: <input value={newEnText} onChange={handleEnTextChange} placeholder="new translation" />
        Päättymispäivä: <input value={newExpiryDate} onChange={handleExpiryDateChange} placeholder="new date" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

const AddWarning = () => {
  //const [showForm, setShowForm] = useState<null | HTMLElement>(null)
  const [showForm, setShowForm] = useState(Boolean)

  const handleAddNew = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    //console.log("kliks")
    setShowForm(!showForm)
  }

  return (
    <div>
      <button onClick={handleAddNew}>Add new</button>
      {showForm && <WarningForm />}
    </div>
  )
}
export default AddWarning
