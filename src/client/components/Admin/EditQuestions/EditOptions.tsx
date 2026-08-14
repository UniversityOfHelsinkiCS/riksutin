import { useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Box, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import { useForm, Controller, Control } from 'react-hook-form'

import { ChoiceType, Locales, Question, OptionUpdates } from '@types'

import { useEditOptionMutation } from '../../../hooks/useOptionMutation'

type Option<A> = A extends readonly (infer T)[] ? T : never

const OptionItem = ({
  language,
  option,
  optionNumber,
  control,
}: {
  language: keyof Locales
  option: Option<ChoiceType>
  optionNumber: number
  control: Control<OptionUpdates>
}) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        p: 2,
        my: 4,
        mx: 4,
        width: '50%',
        '&:hover': {
          border: 1,
          borderColor: '#0288d1',
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ display: 'flex', mb: 2 }} variant="h6">
          {t('admin:optionTitle', { optionNumber })}
          <Typography sx={{ ml: 1 }}>{language}</Typography>
        </Typography>
        <Controller
          name={`title.${language}`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <MDEditor data-color-mode="light" height={200} value={value} onChange={onChange} />
          )}
        />
      </Box>

      {'data' in option && !('text' in option) && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ display: 'flex', mb: 2 }} variant="h6">
            {t('admin:optionText', { optionNumber })}
            <Typography sx={{ ml: 1 }}>{language}</Typography>
          </Typography>
          <Controller
            name={`data.${language}`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <MDEditor data-color-mode="light" height={400} value={value} onChange={onChange} />
            )}
          />
        </Box>
      )}
    </Box>
  )
}

const EditOptions = ({
  option,
  optionNumber,
  question,
  language,
}: {
  option: Option<ChoiceType>
  optionNumber: number
  question: Question
  language: keyof Locales
}) => {
  const { t } = useTranslation()
  const mutation = useEditOptionMutation(question.id, option.id)

  const defaultValues: OptionUpdates = {
    title: option.title,
  }
  if ('data' in option && !('text' in option)) {
    defaultValues.data = option.data
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<OptionUpdates>({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [option, reset])

  const onSubmit = async (data: OptionUpdates) => {
    try {
      await mutation.mutateAsync(data)
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
      reset(data)
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mb: 2, display: 'flex' }}>
        <OptionItem option={option} optionNumber={optionNumber} language="fi" control={control} />
        <OptionItem option={option} optionNumber={optionNumber} language={language} control={control} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
        <Button variant="contained" disabled={!isDirty} type="submit">
          {t('admin:save')}
        </Button>
      </Box>
    </Box>
  )
}

export default EditOptions
