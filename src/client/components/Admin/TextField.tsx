import React from 'react'
import MDEditor from '@uiw/react-md-editor'
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'
import { Box, InputLabel, TextField, Typography } from '@mui/material'

import type { Locales } from '@types'

// This component is used inside RHF form element
export const DialogLocalesField = ({
  value,
  inputlabel,
  control,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
}: {
  value: string
  inputlabel: string
  control: Control<any>
  error: Merge<FieldError, FieldErrorsImpl<Locales>> | undefined
}) => (
  <Box
    sx={{
      p: 2,
      my: 4,
      border: 1,
      borderColor: 'grey.400',
      position: 'relative',
      '&:hover': {
        border: 1,
        borderColor: '#0288d1',
      },
    }}
  >
    <InputLabel
      sx={{
        mt: '-1.75em',
        px: '0.5em',
        zIndex: 2,
        width: 'full',
        backgroundColor: 'white',
        position: 'absolute',
      }}
    >
      {inputlabel}
    </InputLabel>
    {['fi', 'sv', 'en'].map((language) => {
      const isError = error && error[language as keyof Locales]

      return (
        <Controller
          key={`${value}.${language}`}
          name={`${value}.${language}`}
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  display: 'flex',
                  mb: 2,
                  color: isError ? '#d32f2f' : 'inherit',
                }}
                variant="h6"
              >
                {inputlabel}
                <Typography ml={1}>{language}</Typography>
              </Typography>
              {isError && (
                <Typography sx={{ my: 2, color: '#d32f2f' }}>
                  {error[language as keyof Locales]?.message}
                </Typography>
              )}
              <MDEditor {...field} data-color-mode="light" height={200} />
            </Box>
          )}
        />
      )
    })}
  </Box>
)

export const DialogTextField = ({
  value,
  inputlabel,
  control,
  error,
}: {
  value: string
  inputlabel: string
  control: Control<any>
  error: FieldError | undefined
}) => (
  <Box sx={{ my: 4 }}>
    <InputLabel>{inputlabel}</InputLabel>
    <Controller
      name={`${value}`}
      control={control}
      render={({ field }) => (
        <TextField
          error={!!error}
          helperText={error ? error.message : ''}
          sx={{ mt: 2 }}
          multiline
          label={value.toUpperCase()}
          fullWidth
          {...field}
        />
      )}
    />
  </Box>
)
