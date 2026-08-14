import MDEditor from '@uiw/react-md-editor'
import { Box, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import { useForm, Controller, Control } from 'react-hook-form'

import type { Locales } from '@types'
import type { Survey } from '@client/types'
import { UpdatedSurveyInfo } from '@validators/survey'

import { useEditSurveyMutation } from '../../../hooks/useSurveyMutation'

const SurveyItem = ({ language, control }: { language: keyof Locales; control: Control<UpdatedSurveyInfo> }) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        p: 2,
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
          {t('admin:surveyText')}
          <Typography sx={{ ml: 1 }}>{language}</Typography>
        </Typography>
        <Controller
          name={`text.${language}`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <MDEditor data-color-mode="light" height={400} value={value} onChange={onChange} />
          )}
        />
      </Box>
    </Box>
  )
}

const EditSurvey = ({ language, survey }: { language: keyof Locales; survey: Survey }) => {
  const { t } = useTranslation()
  const mutation = useEditSurveyMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdatedSurveyInfo>({
    values: {
      title: survey.title,
      text: survey.text,
    } as UpdatedSurveyInfo,
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const onSubmit = async (data: UpdatedSurveyInfo) => {
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
      <Box sx={{ display: 'flex' }}>
        <SurveyItem language="fi" control={control} />
        <SurveyItem language={language} control={control} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
        <Button variant="contained" disabled={!isDirty} type="submit">
          {t('admin:save')}
        </Button>
      </Box>
    </Box>
  )
}

export default EditSurvey
