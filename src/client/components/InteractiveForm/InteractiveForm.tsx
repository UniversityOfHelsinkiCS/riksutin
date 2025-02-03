import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import { Box, Grid } from '@mui/material'

import type { FormValues, RiskData } from '@types'

import useResults from '../../hooks/useResults'
import useSurvey from '../../hooks/useSurvey'
import usePersistForm from '../../hooks/usePersistForm'
import { useSaveEntryMutation } from '../../hooks/useSaveEntryMutation'

import HelloBanner from './HelloBanner'
import RenderSurvey from './RenderSurvey'
import Results from '../ResultPage/Results'

import { useResultData } from '../../contexts/ResultDataContext'

import styles from '../../styles'
import { FORM_DATA_KEY, LOCATION_KEY } from '../../../config'

const InteractiveForm = () => {
  const { survey, isLoading } = useSurvey()
  const { results } = useResults(survey?.id)
  const { t } = useTranslation()
  const mutation = useSaveEntryMutation(survey?.id)
  const [riskData, setRiskData] = useState<RiskData>()

  const sessionLocation = sessionStorage.getItem(LOCATION_KEY)
  const [showResults, setShowResults] = useState(sessionLocation === 'results')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)

  const { resultData, setResultData } = useResultData()

  const { formStyles } = styles

  const { handleSubmit, control, watch } = useForm({
    mode: 'onSubmit',
    shouldUnregister: true,
    defaultValues: resultData,
  })

  usePersistForm({ value: watch(), sessionStorageKey: FORM_DATA_KEY })

  if (!survey || isLoading || !results) return null

  const onSubmit = async (data: FormValues) => {
    setSubmitButtonLoading(true)
    const submittedData = data
    setResultData(submittedData)
    try {
      const createdData = await mutation.mutateAsync(submittedData)
      const risks = createdData.data
      sessionStorage.setItem(LOCATION_KEY, 'results')
      setShowResults(true)
      document
        ?.getElementById('survey-main-section')
        ?.scrollIntoView({ behavior: 'instant' })
      setRiskData(risks)
      setIsSubmitted(true)
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
        {!showResults && (
          <Grid item sm={12}>
            <HelloBanner />
          </Grid>
        )}
        <Grid item sm={12}>
          <form
            style={{ display: showResults ? 'none' : 'block' }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <RenderSurvey
              questions={survey.Questions}
              control={control}
              watch={watch}
              isSubmitted={isSubmitted}
              submitButtonLoading={submitButtonLoading}
            />
          </form>
        </Grid>

        {riskData && showResults && (
          <Grid item sm={12}>
            <Results setShowResults={setShowResults} riskData={riskData} />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default InteractiveForm
