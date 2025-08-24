import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, Box, TextField, Typography, Button, Stack } from '@mui/material'

import { useTranslation } from 'react-i18next'

import type { Locales } from '@types'
import type { InputProps } from '@client/types'

import useEmployee from '../../hooks/useEmployeeData'
import ShowMore from '../Common/ShowMore'
import LoadingProgress from '../Common/LoadingProgress'
import useLoggedInUser from 'src/client/hooks/useLoggedInUser'

type Option = {
  username: string
  firstName: string
  lastName: string
  email: string
}

const EmployeeSelect = ({ control, question, watch }: InputProps) => {
  const [input, setInput] = useState('')
  const { data: employees = [] } = useEmployee(input)

  const { t, i18n } = useTranslation()
  const { language } = i18n

  const { user, isLoading } = useLoggedInUser()

  if (!question || isLoading || !user) return null

  // for requires these values
  const loggedUserForForm = {
    ...user,
    username: user.id,
    id: user.username,
  }

  const selection = watch ? watch()[question.id] : undefined
  const meSelected = selection && selection.username === loggedUserForForm.username

  return (
    <>
      <Typography component="span">
        <ShowMore text={question.text[language as keyof Locales]} />
      </Typography>
      <Box>
        <Controller
          control={control}
          name={question.id.toString()}
          defaultValue={input}
          rules={{
            required: { value: true, message: t('questions:requiredText') },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '84.5%' }}>
              <Box flex={3}>
                <Autocomplete
                  disablePortal
                  id={`select-${question.id.toString()}`}
                  options={employees}
                  getOptionLabel={(option: Option | null) =>
                    option ? `${option.firstName} ${option.lastName} (${option.email})` : ''
                  }
                  noOptionsText={t('questions:startWriting')}
                  loadingText={<LoadingProgress />}
                  onChange={(e, data) => onChange(data)}
                  sx={{ width: '80%' }}
                  value={value}
                  isOptionEqualToValue={(option, value) => option != null && option.username === value?.username}
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
              <Box flex={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onChange(loggedUserForForm)}
                  sx={{ height: '56px', visibility: meSelected ? 'hidden' : '' }}
                >
                  {t('questions:fillerIsOwner')}
                </Button>
              </Box>
            </Stack>
          )}
        />
      </Box>
    </>
  )
}

export default EmployeeSelect
