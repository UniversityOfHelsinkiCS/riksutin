import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Box, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'

import type { Locales } from '@types'
import type { Survey } from '@client/types'
import { UpdatedSurveyInfo } from '@validators/survey'

import { useEditSurveyMutation } from '../../../hooks/useSurveyMutation'

const SurveyItem = ({ language, survey }: { language: keyof Locales; survey: Survey }) => {
  const { t } = useTranslation()
  const mutation = useEditSurveyMutation()
  const [surveyTitle, setSurveyTitle] = useState<string | undefined>(survey.title[language])
  const [surveyText, setSurveyText] = useState<string | undefined>(survey.text[language])

  useEffect(() => {
    setSurveyTitle(survey.title[language])
    setSurveyText(survey.text[language])
  }, [language, survey])

  const handleSave = async () => {
    const updatedSurveyInfo: UpdatedSurveyInfo = {
      title: {
        ...survey.title,
        [language]: surveyTitle,
      },
      text: {
        ...survey.text,
        [language]: surveyText,
      },
    }

    try {
      await mutation.mutateAsync(updatedSurveyInfo)
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

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
          <Typography ml={1}>{language}</Typography>
        </Typography>
        <MDEditor data-color-mode="light" height={400} value={surveyText} onChange={setSurveyText} />
      </Box>

      <Button variant="outlined" onClick={handleSave}>
        {t('admin:save')}
      </Button>
    </Box>
  )
}

const EditSurvey = ({ language, survey }: { language: keyof Locales; survey: Survey }) => (
  <Box display="flex">
    <SurveyItem language={'fi' as keyof Locales} survey={survey} />
    <SurveyItem language={language} survey={survey} />
  </Box>
)

export default EditSurvey
