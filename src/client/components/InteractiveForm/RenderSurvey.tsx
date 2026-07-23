import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Typography, FormControlLabel, Checkbox, CircularProgress } from '@mui/material'

import type { Locales, Question } from '@types'

import { Control, UseFormWatch } from 'react-hook-form'
import { useFormState } from 'react-hook-form'
import RenderQuestion from './RenderQuestion'
import SurveyButtons from '../Common/SurveyButtons'

import { useResultData } from '../../contexts/ResultDataContext'

import styles from '../../styles'
import ResetForm from '../Common/ResetForm'

const RenderErrors = ({ questions, control }) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const { errors } = useFormState({ control })

  if (Object.values(errors).length === 0) {
    return null
  }

  const getErrorTitle = (id: string) => {
    // 1. Try to find the question in the DB questions array
    const question = questions.find(q => q.id.toString() === id)
    if (question) {
      return question.title[language as keyof Locales]
    }

    // 2. Fallbacks for custom string fields that aren't in the DB questions array
    if (id === 'unit') {
      return t('unitSelect:title')
    }
    if (id === 'faculty') {
      return t('facultySelect:title')
    }
    if (id === 'tuhatProjectExists') {
      return t('tuhatProjectExists:title')
    }
    if (id === 'selectOrganisation') {
      return t('organisationSelect:autocompleteLabel')
    }

    return `Failed to read field id: ${id}`
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography>{t('questions:requiredQuestionsNeedAnswers')}</Typography>
      <ul>
        {Object.keys(errors).map(id => (
          <li key={id}>
            <Typography color="red">{getErrorTitle(id)}</Typography>
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
  saveAsTestVersion,
  setSaveAsTestVersion,
  isEditing,
  disableTestVersionToggle,
}: {
  control: Control<any>
  watch: UseFormWatch<any>
  questions: Question[]
  isSubmitted: boolean
  submitButtonLoading: boolean
  setValue?: any
  saveAsTestVersion: boolean
  setSaveAsTestVersion?: any
  isEditing?: boolean
  disableTestVersionToggle?: boolean
}) => {
  const { t, i18n } = useTranslation()
  const { defaultValues } = useFormState({ control })

  const { resultData } = useResultData()
  const [showQuestions, setShowQuestions] = useState(Boolean(resultData))

  if (!questions || !watch || !defaultValues) {
    return null
  }

  const { cardStyles, formStyles } = styles

  const { language } = i18n

  // // eslint-disable-next-line no-console
  // console.log('FORM')
  // // eslint-disable-next-line no-console
  // console.log(watch())

  return (
    <Box sx={cardStyles.outerBox}>
      {import.meta.env.MODE === 'development' && !isEditing && <ResetForm />}

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

        <RenderErrors control={control} questions={questions} />

        <Box sx={formStyles.stackBox}>
          {!showQuestions ? (
            <Button data-cy="open-form-button" onClick={() => setShowQuestions(true)}>
              {t('openForm')}
            </Button>
          ) : (
            <>
              {!disableTestVersionToggle && (
                <FormControlLabel
                  key={'testVersionCheck'}
                  value={saveAsTestVersion}
                  data-cy={'saveAsTestVersion'}
                  checked={saveAsTestVersion}
                  control={<Checkbox onChange={() => setSaveAsTestVersion(!saveAsTestVersion)} />}
                  label={t('testVersion:saveAsTestForm')}
                />
              )}
              <SurveyButtons isEditing={isEditing}>
                <Button type="submit" data-cy="submit-form-button" variant="contained">
                  {submitButtonLoading ? <CircularProgress /> : isSubmitted ? t('updateSubmit') : t('submit')}
                </Button>
              </SurveyButtons>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default RenderSurvey
