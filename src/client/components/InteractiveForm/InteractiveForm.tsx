import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import { Box, Grid } from '@mui/material'

import { FORM_DATA_KEY, TUHAT_DATA_STORAGE_KEY } from '@config'
import type { FormValues } from '@types'

import useResults from '../../hooks/useResults'
import useSurvey from '../../hooks/useSurvey'
import usePersistForm from '../../hooks/usePersistForm'
import { useSaveEntryMutation } from '../../hooks/useSaveEntryMutation'

import HelloBanner from './HelloBanner'
import RenderSurvey from './RenderSurvey'

import { useResultData } from '../../contexts/ResultDataContext'

import styles from '../../styles'
import { useNavigate } from 'react-router-dom'

const InteractiveForm = () => {
  const { survey, isLoading } = useSurvey()
  const navigate = useNavigate()
  const { results } = useResults(survey?.id)
  const { t } = useTranslation()
  const mutation = useSaveEntryMutation(survey?.id)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)

  const { resultData } = useResultData()

  const { formStyles } = styles

  const { handleSubmit, control, watch, setValue } = useForm({
    mode: 'onSubmit',
    shouldUnregister: true,
    defaultValues: resultData,
  })

  // eslint-disable-next-line no-console
  console.log(watch())

  usePersistForm({ value: watch(), sessionStorageKey: FORM_DATA_KEY })

  if (!survey || isLoading || !results) return null

  const onSubmit = async (data: FormValues) => {
    setSubmitButtonLoading(true)
    const tuhatData = sessionStorage.getItem(TUHAT_DATA_STORAGE_KEY) ?? '{}'

    // if mutlilateran and hyCordinator, some questions have hardcoded answers
    if (data['4'] === 'multilateral' && data['9'] === 'coordinator') {
      data['8'] = 'Finland'
      data['6'] = 'otherType'
      data['22'] = 'unknown'
      data['24'] = 'successfulCollaboration'
    }

    const submittedData = { formData: data, tuhatData: JSON.parse(tuhatData) }
    try {
      const createdData = await mutation.mutateAsync(submittedData)
      setIsSubmitted(true)
      sessionStorage.clear()
      navigate(`/user/${createdData.id}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      enqueueSnackbar(t('common:submitError'), { variant: 'error' })
    }
    setSubmitButtonLoading(false)
  }

  return (
    <Box sx={formStyles.formWrapper}>
      <Grid id="survey-main-section">
        <Grid item sm={12}>
          <HelloBanner />
        </Grid>
        <Grid item sm={12}>
          <form style={{ display: 'block' }} onSubmit={handleSubmit(onSubmit)}>
            <RenderSurvey
              questions={survey.Questions}
              control={control}
              watch={watch}
              isSubmitted={isSubmitted}
              submitButtonLoading={submitButtonLoading}
              setValue={setValue}
            />
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default InteractiveForm
