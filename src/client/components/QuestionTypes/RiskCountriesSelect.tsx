import { Controller } from 'react-hook-form'
import { Autocomplete, Box, TextField } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales } from '@types'
import type { InputProps } from '@client/types'

import useCountries, { useHighRiskCountries } from '../../hooks/useCountries'

const getCountryList = (allCountries, highriskCountries, type) => {
  if (type === 'high') {
    return allCountries
      .filter(country => highriskCountries.some(hrCountry => hrCountry.iso2Code === country.iso2Code))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return allCountries
    .filter(country => !highriskCountries.some(hrCountry => hrCountry.iso2Code === country.iso2Code))
    .sort((a, b) => a.name.localeCompare(b.name))
}

const RiskCountrySelect = ({ control, question, children, watch, type }: InputProps & { type: string }) => {
  const { countries: highriskCountries } = useHighRiskCountries()
  const { countries: allCountries } = useCountries()
  const { i18n } = useTranslation()
  const { language } = i18n
  const { t } = useTranslation()

  if (!question || !highriskCountries || !allCountries || !watch) {
    return null
  }

  const countries = getCountryList(allCountries, highriskCountries, type)
  const highRisks = watch()[26] ? watch()[26] : []
  const noRisks = watch()[28] ? watch()[28] : []

  if (!question || !highriskCountries || !allCountries) return null

  const noSelection = question.id === 26 ? t('questions:noHighRisk') : t('questions:noOtherCountries')

  const noDefault = d => d !== noSelection

  const contriesSelected = highRisks.filter(noDefault).length + noRisks.filter(noDefault).length

  const options = [noSelection].concat(countries.map(country => country.name))

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
              options={options}
              getOptionLabel={option => option}
              onChange={(e, data, reason) => {
                if (reason === 'removeOption') {
                  const acualData = data.length === 0 ? [noSelection] : data
                  onChange(acualData)
                  return
                }
                if (reason === 'selectOption') {
                  if (contriesSelected < 5) {
                    onChange(data.filter(noDefault))
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

export const NonRiskCountrySelect = ({ control, question, children, watch }: InputProps) => {
  return (
    <>
      <RiskCountrySelect control={control} question={question} watch={watch} type="non">
        {children}
      </RiskCountrySelect>
    </>
  )
}

export const HighRiskCountrySelect = ({ control, question, children, watch }: InputProps) => {
  return (
    <>
      <RiskCountrySelect control={control} question={question} watch={watch} type="high">
        {children}
      </RiskCountrySelect>
    </>
  )
}
