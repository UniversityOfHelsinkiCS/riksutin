import { Controller } from 'react-hook-form'
import { Autocomplete, Box, TextField } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales } from '@types'
import type { InputProps } from '@client/types'

import useCountries from '../../hooks/useCountries'

const CountrySelect = ({ control, question, children }: InputProps) => {
  const { countries = [] } = useCountries()

  const { t, i18n } = useTranslation()
  const { language } = i18n

  if (!question) return null

  const countryNames = countries.map(({ name }) => name).sort()

  return (
    <>
      <Controller
        control={control}
        name={question.id.toString()}
        defaultValue=""
        rules={{
          required: { value: true, message: t('questions:requiredText') },
        }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <Autocomplete
              disablePortal
              id={`select-${question.id.toString()}`}
              options={countryNames}
              getOptionLabel={option => option}
              onChange={(e, data) => onChange(data)}
              sx={{ width: '50%' }}
              renderInput={params => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...params}
                  label={question.optionData.label ? question.optionData.label[language as keyof Locales] : ''}
                />
              )}
            />
          </Box>
        )}
      />
      {children}
    </>
  )
}

export default CountrySelect
