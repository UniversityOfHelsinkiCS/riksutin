import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RadioGroup, FormControlLabel, Radio, Box, FormHelperText } from '@mui/material'

import type { Locales, SingleChoiceType } from '@types'
import type { InputProps } from '@client/types'

const SingleChoice = ({ control, question, children, language }: InputProps) => {
  const { t } = useTranslation()
  if (!question) {
    return null
  }

  return (
    <>
      <Controller
        control={control}
        name={question.id.toString()}
        defaultValue=""
        rules={{
          required: { value: true, message: t('questions:requiredText') },
        }}
        render={({ field, fieldState: { error } }) => (
          <Box justifyContent="center">
            <RadioGroup {...field}>
              {question.optionData.options.map((singleOption: SingleChoiceType) => (
                <FormControlLabel
                  data-cy={`choice-select-${singleOption.id}`}
                  key={singleOption.id}
                  value={singleOption.id}
                  label={singleOption.title[language as keyof Locales]}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
            <FormHelperText error>{error ? error.message : null}</FormHelperText>
          </Box>
        )}
      />

      {children}
    </>
  )
}

export default SingleChoice
