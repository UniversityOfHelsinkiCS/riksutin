import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales } from '@types'
import type { InputProps } from '@client/types'

import useEmployee from '../../hooks/useEmployeeData'
import ShowMore from '../Common/ShowMore'
import LoadingProgress from '../Common/LoadingProgress'

const EmployeeSelect = ({ control, question }: InputProps) => {
  const [input, setInput] = useState('')
  const { data = [] } = useEmployee(input)

  const { t, i18n } = useTranslation()
  const { language } = i18n

  if (!question) return null

  return (
    <>
      <Typography component="span">
        <ShowMore text={question.text[language as keyof Locales]} />
      </Typography>
      <Box>
        <Controller
          control={control}
          name={question.id.toString()}
          defaultValue=""
          rules={{
            required: { value: true, message: t('questions:requiredText') },
          }}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <Box>
              <Autocomplete
                disablePortal
                id={`select-${question.id.toString()}`}
                options={data}
                getOptionLabel={option => `${option.firstName} ${option.lastName} (${option.email})`}
                noOptionsText={'Aloita syöte saadaksesi ehdotuksia'}
                loadingText={<LoadingProgress />}
                onChange={(e, data) => onChange(data)}
                sx={{ width: '50%' }}
                renderInput={params => (
                  <TextField
                    helperText={error ? error.message : null}
                    error={!!error}
                    {...params}
                    label={question.optionData.label ? question.optionData.label[language as keyof Locales] : ''}
                    onChange={e => setInput(e.target.value)}
                  />
                )}
              />
            </Box>
          )}
        />
      </Box>
    </>
  )
}

export default EmployeeSelect
