import { useState } from 'react'
import WarningForm from './addWarningForm'

const AddWarning = () => {
  const [showForm, setShowForm] = useState(Boolean)

  const handleAddNew = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowForm(!showForm)
  }

  return (
    <div>
      <button onClick={handleAddNew}>{showForm ? 'Close' : 'Add new'}</button>
      {showForm && <WarningForm />}
    </div>
  )
}
export default AddWarning
