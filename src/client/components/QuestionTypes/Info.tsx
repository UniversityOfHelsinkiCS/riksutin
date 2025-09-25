import { Controller } from 'react-hook-form'
import { Box, TextField } from '@mui/material'

import type { InputProps } from '@client/types'

const Text = ({ control, question, defaultValue }: InputProps) => {
  if (!question) {
    return null
  }

  const props = question.optionData?.attributes ?? {}

  return (
    <Controller
      control={control}
      name={question.id.toString()}
      defaultValue={defaultValue}
      render={() => (
        <Box justifyContent="center">
          <TextField
            data-testid={`question-${question.id}`}
            fullWidth
            InputProps={props}
            defaultValue={defaultValue}
            disabled
          />
        </Box>
      )}
    />
  )
}

export default Text
