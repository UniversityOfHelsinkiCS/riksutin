import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'

import type { Locales } from '@types'

import useSurvey from '../../hooks/useSurvey'
import Markdown from '../Common/Markdown'

import styles from '../../styles'

const HelloBanner = () => {
  const { i18n } = useTranslation()
  const { survey, isLoading: surveyIsLoading } = useSurvey()
  const { language } = i18n

  const { cardStyles } = styles

  if (!survey || surveyIsLoading) {
    return null
  }

  return (
    <Box id="hello-component" sx={cardStyles.helloBox}>
      <Box sx={cardStyles.expendableBox}>
        <Markdown>{survey.text[language as keyof Locales] ?? ''}</Markdown>
      </Box>
    </Box>
  )
}

export default HelloBanner
