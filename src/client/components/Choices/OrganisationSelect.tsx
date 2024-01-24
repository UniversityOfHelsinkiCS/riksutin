import React from 'react'

import { Control, Controller } from 'react-hook-form'
import { Box, TextField, Autocomplete, Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { InputProps } from '../../types'
import useOrganisations from '../../hooks/useOrganisations'
import LoadingProgress from '../Common/LoadingProgress'

const OrganisationList = ({
  inputOrganisation,
  questionId,
  control,
}: {
  inputOrganisation: string
  questionId: string
  control: Control<any> | undefined
}) => {
  const { organisations } = useOrganisations(inputOrganisation)
  const { t } = useTranslation()

  if (!organisations) return <LoadingProgress />

  return organisations.length === 0 ? (
    <Typography
      data-cy="result-section-title"
      variant="body1"
      sx={{ mt: 2, paddingBottom: 2 }}
    >
      {t('organisationSelect:noResults')}
    </Typography>
  ) : (
    <>
      <Typography
        data-cy="result-section-title"
        variant="body1"
        sx={{ mt: 2, paddingBottom: 2 }}
      >
        {t('organisationSelect:listInfoText')}
      </Typography>

      <Controller
        control={control}
        name="selectOrganisation"
        defaultValue=""
        render={({ field: { onChange } }) => (
          <Box justifyContent="center">
            <Autocomplete
              disablePortal
              id={`select-${questionId}`}
              options={organisations}
              getOptionLabel={(option) => option}
              onChange={(e, data) => onChange(data)}
              sx={{ width: '50%' }}
              renderInput={(params) => (
                <TextField {...params} label="organisaatio" />
              )}
            />
          </Box>
        )}
      />
    </>
  )
}

const OrganisationSelect = ({
  control,
  question,
  children,
  watch,
}: InputProps) => {
  if (!question || !watch) return null

  const input = watch(question.id.toString())

  return (
    <>
      <Controller
        control={control}
        name={question.id.toString()}
        defaultValue=""
        render={({ field: { onChange } }) => (
          <Box justifyContent="center">
            <TextField
              data-testid={`question-${question.id}`}
              onChange={onChange}
            />
          </Box>
        )}
      />
      {input && input.length > 1 && (
        <OrganisationList
          inputOrganisation={watch(question.id.toString())}
          questionId={question.id.toString()}
          control={control}
        />
      )}

      {children}
    </>
  )
}

export default OrganisationSelect
