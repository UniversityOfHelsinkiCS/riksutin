import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Box, TextField } from '@mui/material'

import type { InputProps } from '@client/types'

const Text = ({ control, question, defaultValue }: InputProps) => {
  const { t } = useTranslation()
  if (!question) return null

  const props = question.optionData.options.find(({ attributes }) => attributes)

  return (
    <Controller
      control={control}
      name={question.id.toString()}
      defaultValue={defaultValue}
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
            fullWidth
            InputProps={props ? props.attributes : {}}
            defaultValue={defaultValue}
          />
        </Box>
      )}
    />
  )
}

export default Text
