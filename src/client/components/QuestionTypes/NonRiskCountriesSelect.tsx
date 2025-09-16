import { Controller } from 'react-hook-form'
import { Autocomplete, Box, TextField } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales } from '@types'
import type { InputProps } from '@client/types'

import useCountries, { useHighRiskCountries } from '../../hooks/useCountries'

const NonRiskCountrySelect = ({ control, question, children, watch }: InputProps) => {
  const { countries: highriskCountries } = useHighRiskCountries()
  const { countries: allCountries } = useCountries()
  const { i18n } = useTranslation()
  const { language } = i18n
  const { t } = useTranslation()

  if (!question || !highriskCountries || !allCountries || !watch) return null

  const highRisks = watch()[26] ? watch()[26] : []
  const noRisks = watch()[28] ? watch()[28] : []
  const contriesSelected = highRisks.length + noRisks.length

  const countries = allCountries.filter(
    country => !highriskCountries.some(hrCountry => hrCountry.iso2Code === country.iso2Code)
  )

  countries.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Box py={1}>
      <Controller
        control={control}
        name={question.id.toString()}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <Autocomplete
              multiple
              disablePortal
              id={`select-${question.id.toString()}`}
              options={countries.map(country => country.name)}
              getOptionLabel={option => option}
              onChange={(e, data, reason) => {
                if (reason === 'removeOption') {
                  onChange(data)
                  return
                }
                if (reason === 'selectOption') {
                  if (contriesSelected < 5) {
                    onChange(data)
                  } else {
                    // eslint-disable-next-line no-alert
                    alert(t('questions:multilateralWarning'))
                  }
                }
              }}
              sx={{ width: '50%' }}
              value={value ?? []}
              renderInput={params => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...params}
                  label={question.optionData.label ? question.optionData.label[language as keyof Locales] : ''}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: contriesSelected >= 5,
                  }}
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

export default NonRiskCountrySelect
