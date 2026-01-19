import { Box, Stack } from '@mui/material'

import type { InputProps } from '@client/types'

import ResetForm from './ResetForm'

import styles from '../../styles'

const SurveyButtons = ({ children, isEditing }: InputProps & { isEditing?: boolean }) => {
  const { formStyles } = styles

  return (
    <Box sx={formStyles.stackBoxWrapper}>
      <Stack sx={formStyles.stack} direction="row">
        {children}

        {!isEditing && <ResetForm />}
      </Stack>
    </Box>
  )
}

export default SurveyButtons
