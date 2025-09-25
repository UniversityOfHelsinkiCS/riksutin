import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem } from '@mui/material'

import type { Locales } from '@types'

import useSurvey from '../../hooks/useSurvey'
import useQuestions from '../../hooks/useQuestions'
import useResults from '../../hooks/useResults'

import sortQuestions from '../../util/questions'
import sortResults from '../../util/results'

type HandleChange = (event: SelectChangeEvent) => void

const SelectWrapper = ({
  label,
  value,
  handleChange,
  children,
}: {
  label: string
  value: string
  handleChange: HandleChange
  children: React.ReactNode
}) => (
  <Box sx={{ width: '20vw', mx: 4 }}>
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} defaultValue="" onChange={handleChange}>
        {children}
      </Select>
    </FormControl>
  </Box>
)

export const ResultSelect = () => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const { resultId } = useParams()
  const { results } = useResults(1)
  if (!results) {
    return null
  }

  const handleResultChange = (event: SelectChangeEvent) => {
    navigate({
      pathname: `./${event.target.value}`,
      search: location.search,
    })
  }

  const language = i18n.language as keyof Locales
  const sortedResults = sortResults(results, language)

  return (
    <SelectWrapper label="Valitse tulosteksti" value={resultId ?? ''} handleChange={handleResultChange}>
      {sortedResults.map(({ id, data }) => (
        <MenuItem key={id} value={id}>
          {data.title[language]}
        </MenuItem>
      ))}
    </SelectWrapper>
  )
}

export const QuestionSelect = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { questionId } = useParams()

  const { survey } = useSurvey()
  const { questions, isSuccess } = useQuestions(survey?.id)
  if (!isSuccess || !questions) {
    return null
  }

  const handleQuestionChange = (event: SelectChangeEvent) => {
    navigate({
      pathname: `./${event.target.value}`,
      search: location.search,
    })
  }

  const filteredQuestions = questions.filter(({ optionData }) => !['dimensions'].includes(optionData.type))

  const language = i18n.language as keyof Locales
  const sortedQuestions = sortQuestions(filteredQuestions, language)

  return (
    <SelectWrapper label={t('admin:selectQuestion')} value={questionId ?? ''} handleChange={handleQuestionChange}>
      {sortedQuestions.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          {title[language]}
        </MenuItem>
      ))}
    </SelectWrapper>
  )
}
