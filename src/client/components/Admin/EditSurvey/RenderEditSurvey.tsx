import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'

import type { Locales } from '@types'

import useSurvey from '../../../hooks/useSurvey'
import useQuestions from '../../../hooks/useQuestions'

import RenderQuestions from './RenderQuestions'
import EditSurvey from './EditSurvey'

const RenderEditSurvey = () => {
  const { t, i18n } = useTranslation()
  const { survey, isLoading: surveyIsLoading } = useSurvey()
  const { questions, isLoading: questionsIsLoading } = useQuestions(survey?.id)

  if (!survey || surveyIsLoading || !questions || questionsIsLoading) {
    return null
  }

  const selectedLanguage = 'en'

  const { language } = i18n

  const sortedQuestions = questions.sort((a, b) => a.priority - b.priority)

  return (
    <Box sx={{ mx: 2, mt: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography sx={{ my: 4, pl: 1 }} variant="h5">
          {t('admin:surveyViewSurveyEdit')}
        </Typography>
        <EditSurvey language={selectedLanguage} survey={survey} />
      </Box>

      <Box sx={{ my: 5, mr: 4 }}>
        <Typography sx={{ my: 4, pl: 1 }} variant="h5">
          {t('admin:surveyViewQuestionPositionEdit')}
        </Typography>
        <Box sx={{ mt: 5 }}>
          {sortedQuestions.map(question => (
            <div key={question.id}>
              {question.parentId === null && (
                <RenderQuestions question={question} questions={sortedQuestions} language={language as keyof Locales} />
              )}
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default RenderEditSurvey
