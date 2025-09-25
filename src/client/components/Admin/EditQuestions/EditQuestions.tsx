import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import type { Question, Locales } from '@types'

import useSurvey from '../../../hooks/useSurvey'
import useQuestions from '../../../hooks/useQuestions'

import EditOptions from './EditOptions'
import EditQuestion from './EditQuestion'

const OptionSection = ({
  selectedQuestion,
  selectedLanguage,
}: {
  selectedQuestion: Question | undefined
  selectedLanguage: keyof Locales
}) => {
  const { t } = useTranslation()

  if (!selectedQuestion || !['singleChoice', 'multipleChoice'].includes(selectedQuestion.optionData.type)) {
    return null
  }

  const options = selectedQuestion?.optionData.options || []

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          my: 4,
          justifyContent: 'flex-start',
        }}
      >
        <Typography sx={{ my: 2, pl: 1 }} variant="h4">
          {t('admin:questionOptionViewInfo')}
        </Typography>
      </Box>

      {options.map((option, index) => (
        <EditOptions
          key={option.id}
          option={option}
          optionNumber={index + 1}
          question={selectedQuestion}
          language={selectedLanguage}
        />
      ))}
    </Box>
  )
}

const EditQuestions = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { questionId } = useParams()

  const { survey } = useSurvey()
  const { questions, isLoading } = useQuestions(survey?.id)

  if (isLoading || !survey || !questions || !questionId) {
    return null
  }

  const selectedLanguage = 'en'

  const selectedQuestion = questions.find(question => question.id === Number(questionId))

  const handleQuestionDeletion = () => {
    navigate({
      pathname: '/admin/edit-questions',
      search: location.search,
    })
  }

  return (
    <Box width="100%" flexWrap="wrap">
      {selectedQuestion ? (
        <Box sx={{ my: 4 }}>
          <Typography sx={{ my: 4, pl: 1 }} variant="h4">
            {t('admin:questionViewQuestionEdit')}
          </Typography>
          <EditQuestion language={selectedLanguage} question={selectedQuestion} onDelete={handleQuestionDeletion} />
        </Box>
      ) : (
        <Typography sx={{ my: 4, pl: 1 }} variant="h4">
          {t('admin:questionViewInfo')}
        </Typography>
      )}
      <OptionSection selectedQuestion={selectedQuestion} selectedLanguage={selectedLanguage} />
    </Box>
  )
}

export default EditQuestions
