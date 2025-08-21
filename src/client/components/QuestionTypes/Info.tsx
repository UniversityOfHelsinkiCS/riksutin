import { Box, TextField } from '@mui/material'

import type { InputProps } from '@client/types'

const Info = ({ question, defaultValue }: InputProps) => {
  if (!question) return null

  const props = question.optionData?.attributes ?? {}

  return (
    <Box justifyContent="center">
      <TextField
        data-testid={`question-${question.id}`}
        fullWidth
        InputProps={props}
        defaultValue={defaultValue}
        disabled
      />
    </Box>
  )
}

export default Info
