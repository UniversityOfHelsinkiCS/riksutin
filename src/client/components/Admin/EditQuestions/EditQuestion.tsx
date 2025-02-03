/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Box, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'

import type { Locales, Question } from '@types'

import {
  useDeleteQuestionMutation,
  useEditQuestionMutation,
} from '../../../hooks/useQuestionMutation'

import DeleteDialog from '../DeleteDialog'

import { UpdatedQuestion } from '../../../../validators/questions'

const QuestionItem = ({
  language,
  question,
}: {
  language: keyof Locales
  question: Question
}) => {
  const { t } = useTranslation()
  const mutation = useEditQuestionMutation(question.id)
  const [questionTitle, setQuestionTitle] = useState<string | undefined>(
    question.title[language]
  )
  const [questionText, setQuestionText] = useState<string | undefined>(
    question.text[language]
  )

  useEffect(() => {
    setQuestionTitle(question.title[language])
    setQuestionText(question.text[language])
  }, [language, question])

  const handleSave = async () => {
    const updatedQuestion: UpdatedQuestion = {
      title: {
        ...question.title,
        [language]: questionTitle,
      },
      text: {
        ...question.text,
        [language]: questionText,
      },
    }

    try {
      await mutation.mutateAsync(updatedQuestion)
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

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
          <Typography ml={1}>{language}</Typography>
        </Typography>
        <MDEditor
          data-color-mode="light"
          height={200}
          value={questionTitle}
          onChange={setQuestionTitle}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ display: 'flex', mb: 2 }} variant="h6">
          {t('admin:questionText')}
          <Typography ml={1}>{language}</Typography>
        </Typography>
        <MDEditor
          data-color-mode="light"
          height={400}
          value={questionText}
          onChange={setQuestionText}
        />
      </Box>

      <Button variant="outlined" onClick={handleSave}>
        {t('admin:save')}
      </Button>
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
  const mutation = useDeleteQuestionMutation(question.id)

  const selectedLanguage = i18n.language

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync()
      enqueueSnackbar(t('admin:deleteSuccess'), { variant: 'success' })
      setOpenAlert(false)
      onDelete('') // callback to reset the selected question ID
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  return (
    <>
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
      <Box mb={5} display="flex">
        <QuestionItem language={'fi' as keyof Locales} question={question} />
        <QuestionItem language={language} question={question} />
      </Box>
    </>
  )
}

export default EditQuestion
