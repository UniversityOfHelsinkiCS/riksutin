import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Box, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import { useForm, Controller, Control } from 'react-hook-form'

import type { Locales, Question } from '@types'
import { UpdatedQuestion } from '@validators/questions'

import { useDeleteQuestionMutation, useEditQuestionMutation } from '../../../hooks/useQuestionMutation'

import DeleteDialog from '../DeleteDialog'

const QuestionItem = ({ language, control }: { language: keyof Locales; control: Control<UpdatedQuestion> }) => {
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
          {t('admin:questionTitle')}
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

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ display: 'flex', mb: 2 }} variant="h6">
          {t('admin:questionText')}
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

const EditQuestion = ({
  language,
  question,
  onDelete,
}: {
  language: keyof Locales
  question: Question
  onDelete: React.Dispatch<React.SetStateAction<string>>
}) => {
  const { t, i18n } = useTranslation()
  const [openAlert, setOpenAlert] = useState(false)
  const deleteMutation = useDeleteQuestionMutation(question.id)
  const editMutation = useEditQuestionMutation(question.id)

  const selectedLanguage = i18n.language

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdatedQuestion>({
    values: {
      title: question.title,
      text: question.text,
    } as UpdatedQuestion,
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
      enqueueSnackbar(t('admin:deleteSuccess'), { variant: 'success' })
      setOpenAlert(false)
      onDelete('') // callback to reset the selected question ID
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const onSubmit = async (data: UpdatedQuestion) => {
    try {
      await editMutation.mutateAsync(data)
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
      reset(data)
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Button
        sx={{
          ml: 4,
          alignSelf: 'center',
        }}
        variant="outlined"
        color="error"
        onClick={() => setOpenAlert(!openAlert)}
      >
        {t('admin:questionRemove', {
          questionName: question.title[selectedLanguage as keyof Locales],
        })}
      </Button>
      <DeleteDialog
        open={openAlert}
        title={t('admin:questionRemoveQuestionInfo', {
          questionName: question.title[selectedLanguage as keyof Locales],
        })}
        content={t('admin:questionRemoveQuestionContent')}
        setOpen={setOpenAlert}
        onSubmit={handleDelete}
      />
      <Box sx={{ display: 'flex' }}>
        <QuestionItem language={'fi'} control={control} />
        <QuestionItem language={language} control={control} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
        <Button variant="contained" disabled={!isDirty} type="submit">
          {t('admin:save')}
        </Button>
      </Box>
    </Box>
  )
}

export default EditQuestion
