import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Box, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'

import { ChoiceType, Locales, Question, OptionUpdates } from '@types'

import { useEditOptionMutation } from '../../../hooks/useOptionMutation'

type Option<A> = A extends readonly (infer T)[] ? T : never

const OptionItem = ({
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
  const [optionTitle, setOptionTitle] = useState<string | undefined>(option.title[language])
  const [optionData, setOptionData] = useState<string | undefined>('')

  useEffect(() => {
    if ('data' in option && !('text' in option)) {
      setOptionData(option.data[language]) // Type narrow the multichoice type
    }
    setOptionTitle(option.title[language])
  }, [language, option])

  const handleSave = async () => {
    let updatedOption: OptionUpdates = {
      title: {
        ...option.title,
        [language]: optionTitle,
      },
    }
    if ('data' in option && !('text' in option)) {
      updatedOption = {
        data: {
          ...option.data,
          [language]: optionData,
        },
        ...updatedOption,
      }
    }

    try {
      await mutation.mutateAsync(updatedOption)
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
          {t('admin:optionTitle', { optionNumber })}
          <Typography ml={1}>{language}</Typography>
        </Typography>
        <MDEditor data-color-mode="light" height={200} value={optionTitle} onChange={setOptionTitle} />
      </Box>

      {optionData && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ display: 'flex', mb: 2 }} variant="h6">
            {t('admin:optionText', { optionNumber })}
            <Typography ml={1}>{language}</Typography>
          </Typography>
          <MDEditor data-color-mode="light" height={400} value={optionData} onChange={setOptionData} />
        </Box>
      )}

      <Button variant="outlined" onClick={handleSave}>
        {t('admin:save')}
      </Button>
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
  const { t: _ } = useTranslation()

  return (
    <Box mb={2} display="flex">
      <OptionItem option={option} optionNumber={optionNumber} question={question} language={'fi' as keyof Locales} />
      <OptionItem option={option} optionNumber={optionNumber} question={question} language={language} />
    </Box>
  )
}

export default EditOptions
