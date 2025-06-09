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
      <button
        onClick={handleAddNew}
        style={{
          padding: '3px',
          width: '10%',
          color: '#107eab',
          borderColor: '#87bed5',
          borderStyle: 'solid',
          borderRadius: '5px',
        }}
      >
        {showForm ? 'Close' : 'Add new'}
      </button>
      {showForm && <WarningForm />}
    </div>
  )
}
export default AddWarning
