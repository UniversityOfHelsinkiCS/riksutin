import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, Checkbox, FormControlLabel, FormHelperText } from '@mui/material'

import type { MultipleChoiceType, Locales } from '@types'
import type { InputProps } from '@client/types'

const MultiChoice = ({ control, question, children, language }: InputProps) => {
  const { t } = useTranslation()
  if (!question) return null

  return (
    <>
      <Controller
        name={question.id.toString()}
        control={control}
        defaultValue={[]}
        rules={{
          required: { value: true, message: t('questions:requiredText') },
        }}
        render={({ field, fieldState: { error } }) => (
          <Box>
            <FormControl>
              {(question.optionData.options as MultipleChoiceType[]).map((choice: MultipleChoiceType) => (
                <FormControlLabel
                  key={choice.id}
                  value={choice.id}
                  checked={field.value.includes(choice.id)}
                  control={
                    <Checkbox
                      onChange={() => {
                        if (!field.value.includes(choice.id)) {
                          field.onChange([...field.value, choice.id])
                          return
                        }
                        const newValues = field.value.filter((c: string) => c !== choice.id)
                        field.onChange(newValues)
                      }}
                    />
                  }
                  label={choice.title[language as keyof Locales]}
                />
              ))}
              <FormHelperText error>{error ? error.message : null}</FormHelperText>
            </FormControl>
          </Box>
        )}
      />
      {children}
    </>
  )
}

export default MultiChoice
