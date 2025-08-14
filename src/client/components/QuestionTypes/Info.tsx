import { Box } from '@mui/material'

import type { InputProps } from '@client/types'

const Info = ({ question, defaultValue }: InputProps) => {
  if (!question) return null

  return (
    <Box justifyContent="center" style={{ padding: 15 }}>
      {defaultValue}
    </Box>
  )
}

export default Info
