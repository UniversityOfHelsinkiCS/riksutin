/* eslint-disable no-console */
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import { Box, Grid, Alert } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'

import { FORM_DATA_KEY } from '@config'
import type { FormValues } from '@types'

import useResults from '../../hooks/useResults'
import useSurvey from '../../hooks/useSurvey'
import usePersistForm from '../../hooks/usePersistForm'
import { useUpdateEntryMutation } from '../../hooks/useSaveEntryMutation'
import { useEntry } from '../../hooks/useEntry'

import HelloBanner from './HelloBanner'
import RenderSurvey from './RenderSurvey'

import styles from '../../styles'
import { noDefault, NO_SELECTION } from 'src/client/util/multilataral'

const EditEntry = () => {
  const { entryId } = useParams<{ entryId: string }>()
  const { entry, isLoading: entryLoading } = useEntry(entryId)
  const { survey, isLoading } = useSurvey()
  const navigate = useNavigate()
  const { results } = useResults(survey?.id)
  const { t } = useTranslation()
  const mutation = useUpdateEntryMutation(entryId)

  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)
  const [saveAsTestVersion, setSaveAsTestVersion] = useState(entry?.testVersion ?? false)
  const hasResetRef = useRef(false)

  const { formStyles } = styles

  // Initialize form with existing entry data (must happen before early return to avoid hook order issues)
  const defaultValues: FormValues = entry?.data?.answers ?? ({} as FormValues)
  defaultValues[26] = defaultValues[26] ?? [NO_SELECTION]
  defaultValues[28] = defaultValues[28] ?? [NO_SELECTION]

  console.log('DEBUG1')
  console.log(defaultValues)

  // For HY: Initialize tuhatProjectExists based on saved value or TUHAT data
  if (entry && !defaultValues.tuhatProjectExists) {
    // Only set if not already saved in answers
    const hasTuhatData = (entry as any).tuhatData && Object.keys((entry as any).tuhatData).length > 0
    if (hasTuhatData) {
      defaultValues.tuhatProjectExists = 'tuhatOptionPositive'
    } else if (defaultValues['3']) {
      // If there's a project name in field 3, it means it's not a TUHAT project
      defaultValues.tuhatProjectExists = 'tuhatOptionNegative'
    }
  }

  const { handleSubmit, control, watch, setValue, reset } = useForm({
    mode: 'onSubmit',
    shouldUnregister: true,
    defaultValues,
  })

  usePersistForm({ value: watch(), sessionStorageKey: FORM_DATA_KEY })

  // Update form values when entry loads (only once)
  useEffect(() => {
    if (entry && !entryLoading && !hasResetRef.current) {
      const values: FormValues = entry.data?.answers ?? ({} as FormValues)
      values[26] = values[26] ?? [NO_SELECTION]
      values[28] = values[28] ?? [NO_SELECTION]

      if (!values.tuhatProjectExists) {
        const hasTuhatData = (entry as any).tuhatData && Object.keys((entry as any).tuhatData).length > 0
        if (hasTuhatData) {
          values.tuhatProjectExists = 'tuhatOptionPositive'
        } else if (values['3']) {
          values.tuhatProjectExists = 'tuhatOptionNegative'
        }
      }

      console.log('DEBUG2')
      console.log(values)

      reset(values, { keepDefaultValues: false })
      hasResetRef.current = true
    }
  }, [entry, entryLoading, reset])

  // Wait for entry to load - must be after all hooks
  if (!survey || isLoading || !results || !entry || entryLoading) {
    return null
  }

  const onSubmit = async (data: FormValues) => {
    if (saveAsTestVersion) {
      // eslint-disable-next-line no-alert
      if (!window.confirm(`${t('testVersion:saveAsTestFormVerification')}`)) {
        return
      }
    }

    const hyCordMultilat = data['4'] === 'multilateral' && data['9'] === 'coordinator'

    // remove defaults from multilateral country lists
    data[26] = data[26] ? data[26].filter(noDefault) : []
    data[28] = data[28] ? data[28].filter(noDefault) : []
    const partners = data[26].concat(data[28])

    if (hyCordMultilat && partners.length === 0) {
      // eslint-disable-next-line no-alert
      alert(t('questions:multilateralNoCountriesWarning'))
      return
    }

    setSubmitButtonLoading(true)
    const tuhatData = (entry as any).tuhatData ?? {}

    // if multilateral and hyCordinator, some questions have hardcoded answers
    if (hyCordMultilat) {
      data['8'] = 'Finland'
      data['6'] = 'otherType'
      data['22'] = 'unknown'
      data['24'] = 'successfulCollaboration'
    }

    const submittedData = { formData: data, tuhatData, testVersion: saveAsTestVersion }
    try {
      await mutation.mutateAsync(submittedData)
      sessionStorage.clear()
      enqueueSnackbar(t('common:updateSuccess'), { variant: 'success' })
      navigate(`/user/${entryId}`)
    } catch (error) {
      console.log(error)
      enqueueSnackbar(t('common:updateError'), { variant: 'error' })
    }
    setSubmitButtonLoading(false)
  }

  return (
    <Box sx={formStyles.formWrapper}>
      <Grid id="survey-main-section">
        <Grid item sm={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            {t('editEntry:editingEntryInfo', {
              date: new Date(entry.createdAt).toLocaleDateString('fi-FI'),
              time: new Date(entry.createdAt).toLocaleTimeString(),
            })}
            {entry.data.updatedData && entry.data.updatedData.length > 0 && (
              <> {t('editEntry:previousUpdates', { count: entry.data.updatedData.length })}</>
            )}
          </Alert>
          <HelloBanner />
        </Grid>
        <Grid item sm={12}>
          <form style={{ display: 'block' }} onSubmit={handleSubmit(onSubmit)}>
            <RenderSurvey
              questions={survey.Questions}
              control={control}
              watch={watch}
              isSubmitted
              submitButtonLoading={submitButtonLoading}
              setValue={setValue}
              saveAsTestVersion={saveAsTestVersion}
              setSaveAsTestVersion={setSaveAsTestVersion}
              isEditing
            />
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EditEntry
