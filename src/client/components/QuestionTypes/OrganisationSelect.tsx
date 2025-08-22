import { Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Box, TextField, Autocomplete, Typography } from '@mui/material'

import type { InputProps } from '@client/types'

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

  organisations?.sort((a, b) => a.localeCompare(b))

  if (!organisations) return <LoadingProgress />

  return organisations.length === 0 ? (
    <Typography data-cy="result-section-title" variant="body1" sx={{ mt: 2, paddingBottom: 2 }}>
      {t('organisationSelect:noResults')}
    </Typography>
  ) : (
    <>
      <Typography data-cy="result-section-title" variant="body1" sx={{ mt: 2, paddingBottom: 2 }}>
        {t('organisationSelect:listInfoText')}
      </Typography>

      <Controller
        control={control}
        name="selectOrganisation"
        defaultValue=""
        rules={{
          required: { value: true, message: t('questions:requiredText') },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <Autocomplete
              disablePortal
              id={`select-${questionId}`}
              options={organisations} //organisations
              getOptionLabel={option => option}
              onChange={(e, data) => onChange(data)}
              sx={{ width: '50%' }}
              value={value}
              renderInput={params => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...params}
                  label={t('organisationSelect:autocompleteLabel')}
                />
              )}
            />
          </Box>
        )}
      />
    </>
  )
}

const OrganisationSelect = ({ control, question, children, watch }: InputProps) => {
  if (!question || !watch) return null

  const input = watch(question.id.toString())

  const selection = watch('selectOrganisation')

  return (
    <>
      <Controller
        control={control}
        name={question.id.toString()}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Box justifyContent="center">
            {!selection && (
              <TextField data-testid={`question-${question.id}`} onChange={onChange} fullWidth value={value} />
            )}
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
