import React from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, Box, TextField } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales } from '@types'
import type { InputProps } from '@frontend/types'

import { useHighRiskCountries } from '../../hooks/useCountries'

const HighRiskCountrySelect = ({ control, question, children }: InputProps) => {
  const { countries } = useHighRiskCountries()
  const { i18n } = useTranslation()
  const { language } = i18n

  if (!question || !countries) return null

  countries.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Box py={1}>
      <Controller
        control={control}
        name={question.id.toString()}
        defaultValue=""
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <Autocomplete
              multiple
              disablePortal
              id={`select-${question.id.toString()}`}
              options={
                // eslint-disable-next-line no-nested-ternary
                countries.map((country) => country.name)
              }
              getOptionLabel={(option) => option}
              onChange={(e, data) => onChange(data)}
              sx={{ width: '50%' }}
              renderInput={(params) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...params}
                  label={
                    question.optionData.label
                      ? question.optionData.label[language as keyof Locales]
                      : ''
                  }
                />
              )}
            />
          </Box>
        )}
      />
      {children}
    </Box>
  )
}

export default HighRiskCountrySelect
