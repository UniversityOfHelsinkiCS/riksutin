import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

import type { Locales, Question } from '@types'

import { Control, UseFormWatch } from 'react-hook-form/dist/types'
import { useFormState } from 'react-hook-form'
import RenderQuestion from './RenderQuestion'
import SurveyButtons from '../Common/SurveyButtons'

import { useResultData } from '../../contexts/ResultDataContext'

import styles from '../../styles'
import ResetForm from '../Common/ResetForm'

const RenderErrors = ({ requiredFields, questions, control }) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const { dirtyFields, errors } = useFormState({ control })

  if (Object.values(errors).length === 0) {
    return null
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography>{t('questions:requiredQuestionsNeedAnswers')}</Typography>
      <ul>
        {requiredFields
          .filter(id => !Object.keys(dirtyFields).includes(id))
          .map(id => (
            <li key={id}>
              <Typography color="red">
                {questions.find(q => q.id.toString() === id)?.title[language as keyof Locales] ??
                  `Failed to read field id: ${id}`}
              </Typography>
            </li>
          ))}
      </ul>
    </Box>
  )
}

const RenderSurvey = ({
  questions,
  control,
  watch,
  isSubmitted,
  submitButtonLoading,
  setValue,
}: {
  control: Control<any>
  watch: UseFormWatch<any>
  questions: Question[]
  isSubmitted: boolean
  submitButtonLoading: boolean
  setValue?: any
}) => {
  const { t, i18n } = useTranslation()
  const { defaultValues } = useFormState({ control })

  const { resultData } = useResultData()
  const [showQuestions, setShowQuestions] = useState(Boolean(resultData))

  if (!questions || !watch || !defaultValues) return null

  const { cardStyles, formStyles } = styles

  const { language } = i18n

  const requiredFields = Object.keys(defaultValues).filter(value => !['1', '2', '7', 'faculty'].includes(value))

  console.log('TOIMIIKO')

  return (
    <Box sx={cardStyles.outerBox}>
      {import.meta.env.MODE === 'development' && <ResetForm />}

      <Box sx={cardStyles.card}>
        {questions.map(question => (
          <Box key={question.id} sx={cardStyles.card}>
            {showQuestions && question.parentId === null && (
              <RenderQuestion
                control={control}
                watch={watch}
                question={question}
                questions={questions}
                language={language}
                setValue={setValue}
              />
            )}
          </Box>
        ))}

        <RenderErrors control={control} requiredFields={requiredFields} questions={questions} />

        <Box sx={formStyles.stackBox}>
          {!showQuestions ? (
            <Button data-cy="open-form-button" onClick={() => setShowQuestions(true)}>
              {t('openForm')}
            </Button>
          ) : (
            <SurveyButtons>
              <LoadingButton
                sx={formStyles.stackButton}
                type="submit"
                data-cy="submit-form-button"
                variant="contained"
                loading={submitButtonLoading}
              >
                {isSubmitted ? t('updateSubmit') : t('submit')}
              </LoadingButton>
            </SurveyButtons>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default RenderSurvey
