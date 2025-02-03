import React from 'react'
import { Box, Stack } from '@mui/material'

import type { InputProps } from '@frontend/types'

import ResetForm from './ResetForm'

import styles from '../../styles'

const SurveyButtons = ({ children }: InputProps) => {
  const { formStyles } = styles

  return (
    <Box sx={formStyles.stackBoxWrapper}>
      <Stack sx={formStyles.stack} direction="row">
        {children}

        <ResetForm />
      </Stack>
    </Box>
  )
}

export default SurveyButtons
