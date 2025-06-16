import { useState } from 'react'
import WarningForm from './addWarningForm'
import ErrorMessage from './ErrorMessage'
import InfoMessage from './InfoMessage'
import { useTranslation } from 'react-i18next'

const AddWarning = () => {
  const [showForm, setShowForm] = useState(Boolean)
  const [newStatusText, setNewStatusText] = useState('')
  const [newErrorText, setNewErrorText] = useState('')
  const { t } = useTranslation()

  const handleAddNew = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowForm(!showForm)
  }

  return (
    <div>
      <InfoMessage text={newStatusText} />
      <ErrorMessage text={newErrorText} />
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
        {showForm ? `${t('admin:close')}` : `${t('admin:addNew')}`}
      </button>
      {showForm && (
        <WarningForm
          showForm={showForm}
          setShowForm={setShowForm}
          setNewStatusText={setNewStatusText}
          setNewErrorText={setNewErrorText}
        />
      )}
    </div>
  )
}

export default AddWarning
