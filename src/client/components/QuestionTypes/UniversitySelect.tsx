import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'

import { Locales, Question } from '@backend/types'

import useCountry from '../../hooks/useCountryData'
import { InputProps } from '../../types'
import LoadingProgress from '../Common/LoadingProgress'
import ShowMore from '../Common/ShowMore'

const AdditionalTextField = ({
  control,
}: {
  control: Control<any> | undefined
}) => {
  const { t } = useTranslation()
  return (
    <Controller
      control={control}
      name="21"
      defaultValue=""
      rules={{
        required: {
          value: true,
          message: t('questions:requiredText'),
        },
      }}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box justifyContent="center">
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            data-testid="question-21"
            onChange={onChange}
            defaultValue=""
            sx={{ width: '50%' }}
          />
        </Box>
      )}
    />
  )
}

const UniversitySelect = ({
  control,
  question,
  selectedCountry,
}: InputProps) => {
  const { country } = useCountry(selectedCountry)
  const { t, i18n } = useTranslation()
  const [showUniversityList, setShowUniversityList] = useState(true)
  const { language } = i18n

  if (!question) return null

  if (!selectedCountry)
    return (
      <Box>
        <i>{t('questions:selectUniversityInfoMessage')}</i>
      </Box>
    )

  return (
    <>
      <Typography component="span" sx={{ color: 'red' }}>
        {'* '}
      </Typography>
      <Typography component="span">
        {question.title[language as keyof Locales]}
        {!showUniversityList ? (
          <ShowMore text="Kirjoita tähän yhteistyöyliopiston nimi, jos sitä ei löydy yllä olevasta listasta." />
        ) : (
          question.text[language as keyof Locales] && (
            <ShowMore text={question.text[language as keyof Locales]} />
          )
        )}
      </Typography>
      <Box>
        {!country ? (
          <LoadingProgress />
        ) : (
          <Controller
            control={control}
            name={question.id.toString()}
            defaultValue=""
            rules={{
              required: { value: true, message: t('questions:requiredText') },
            }}
            render={({ field: { onChange }, fieldState: { error } }) =>
              showUniversityList ? (
                <Box>
                  <Autocomplete
                    disablePortal
                    id={`select-${question.id.toString()}`}
                    options={
                      country?.universities || question.optionData.options
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
                            ? question.optionData.label[
                                language as keyof Locales
                              ]
                            : ''
                        }
                      />
                    )}
                  />
                </Box>
              ) : (
                <AdditionalTextField control={control} />
              )
            }
          />
        )}
        <Button
          onClick={() => setShowUniversityList(!showUniversityList)}
          sx={{ m: 2 }}
        >
          {showUniversityList ? 'Lisää yliopisto itse' : 'Palaa listaukseen'}
        </Button>
      </Box>
    </>
  )
}

export default UniversitySelect
