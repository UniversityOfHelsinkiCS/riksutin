import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'

import useSurvey from '../../../hooks/useSurvey'
import useResults from '../../../hooks/useResults'

import EditResult from './EditResult'

const EditResults = () => {
  const { resultId } = useParams()

  const { survey } = useSurvey()
  const { results, isSuccess: resultsFetched } = useResults(survey?.id)

  const selectedLanguage = 'en'

  if (!resultsFetched || !results || !survey) return null

  const selectedResult = results.find(result => result.id === Number(resultId))

  if (!selectedResult) return null

  return (
    <Box>
      <EditResult key={selectedResult.id} language={selectedLanguage} result={selectedResult} />
    </Box>
  )
}

export default EditResults
