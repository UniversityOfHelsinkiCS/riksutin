import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales, Question } from '@types'
import type { InputProps } from '@client/types'

import useCountry from '../../hooks/useCountryData'
import LoadingProgress from '../Common/LoadingProgress'
import ShowMore from '../Common/ShowMore'

const AdditionalTextField = ({ question, control }: { question: Question; control: Control<any> | undefined }) => {
  const { t } = useTranslation()
  return (
    <Controller
      control={control}
      name={question.id.toString()}
      defaultValue=""
      rules={{
        required: {
          value: question.id !== 7,
          message: t('questions:requiredText'),
        },
      }}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box justifyContent="center">
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            data-testid={`question-${question.id}`}
            onChange={onChange}
            defaultValue=""
            sx={{ width: '50%' }}
          />
        </Box>
      )}
    />
  )
}

const UniversitySelect = ({ control, question, selectedCountry }: InputProps) => {
  const { country, isLoading } = useCountry(selectedCountry)
  const { t, i18n } = useTranslation()
  const [showUniversityList, setShowUniversityList] = useState(true)
  const { language } = i18n

  if (!selectedCountry)
    return (
      <Box>
        <i>{t('questions:selectUniversityInfoMessage')}</i>
      </Box>
    )

  if (!question) return null

  if (isLoading) return <LoadingProgress />

  const autocompleteOptions = country?.universities.sort() ?? question.optionData.options

  return (
    <>
      <Typography component="span" sx={{ color: 'red' }}>
        {'* '}
      </Typography>
      <Typography component="span">
        {question.title[language as keyof Locales]}
        {!showUniversityList ? (
          <ShowMore text={t('universitySelect:textFieldInfo')} />
        ) : (
          question.text[language as keyof Locales] && <ShowMore text={question.text[language as keyof Locales]} />
        )}
      </Typography>
      <Box>
        <Controller
          control={control}
          name={question.id.toString()}
          defaultValue=""
          rules={{
            required: { value: true, message: t('questions:requiredText') },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) =>
            showUniversityList ? (
              <Box>
                <Autocomplete
                  disablePortal
                  id={`select-${question.id.toString()}`}
                  options={autocompleteOptions}
                  getOptionLabel={option => option}
                  onChange={(e, data) => onChange(data)}
                  sx={{ width: '50%' }}
                  value={value}
                  isOptionEqualToValue={(option, val) => option === val || val === ''}
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
            ) : (
              <AdditionalTextField question={question} control={control} />
            )
          }
        />
        <Button onClick={() => setShowUniversityList(!showUniversityList)} sx={{ m: 2 }}>
          {showUniversityList ? `${t('questions:addUniversityManually')}` : `${t('questions:returnToListing')}`}
        </Button>
      </Box>
    </>
  )
}

export default UniversitySelect
