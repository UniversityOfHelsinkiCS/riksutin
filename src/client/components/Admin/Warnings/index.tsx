import RenderWarnings from './RenderWarnings'
import AddWarning from './AddWarning'
import ErrorMessage from './ErrorMessage'
import InfoMessage from './InfoMessage'
import { useState } from 'react'

const RenderMainWarningsPage = () => {
  const [newErrorText, setNewErrorText] = useState('')
  const [newInfoText, setNewInfoText] = useState('')
  return (
    <div>
      <p></p>
      <ErrorMessage text={newErrorText} />
      <InfoMessage text={newInfoText} />
      <AddWarning />
      <RenderWarnings setNewErrorText={setNewErrorText} setNewInfoText={setNewInfoText} />
    </div>
  )
}

export default RenderMainWarningsPage
