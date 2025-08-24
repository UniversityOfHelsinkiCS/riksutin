import { UseFormWatch, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Box, Typography, TextField } from '@mui/material'

import type { Locales, PossibleChoiceTypes, Question } from '@types'
import type { InputProps } from '@client/types'

import MultiChoice from '../QuestionTypes/MultiChoice'
import SingleChoice from '../QuestionTypes/SingleChoice'
import Text from '../QuestionTypes/Text'
import ShowMore from '../Common/ShowMore'

import styles from '../../styles'
import useCountries from '../../hooks/useCountries'
import SelectFaculty from '../Common/SelectFaculty'
import SelectUnit from '../Common/SelectUnit'
import OrganisationSelect from '../QuestionTypes/OrganisationSelect'
import UniversitySelect from '../QuestionTypes/UniversitySelect'
import HighRiskCountrySelect from '../QuestionTypes/HighRiskCountriesSelect'
import CountrySelect from '../QuestionTypes/CountrySelect'
import EmployeeSelect from '../QuestionTypes/EmployeeSelect'
import SelectTuhatProject from '../Common/TuhatProjectSelect'
import Info from '../QuestionTypes/Info'
import { useResultData } from 'src/client/contexts/ResultDataContext'
import { ORGANISATION_ID } from '@userconfig'

const { cardStyles } = styles

const QuestionText = ({
  question,
  language,
  watch,
}: {
  question: Question
  language: keyof Locales
  watch: UseFormWatch<any>
}) => {
  const { t } = useTranslation()

  if (question.id === 20) return null

  return (
    <>
      <Typography component="span" sx={{ color: 'red' }}>
        {![1, 7, 26].includes(question.id) && '* '}
      </Typography>
      <Typography component="span">
        {question.id === 8 && watch('4') === 'multilateral'
          ? t('questions:additionalPartnerOrganisationCountryQuestion')
          : question.id === 6 && watch('4') === 'multilateral'
            ? t('questions:additionalPartnerOrganisationTypeQuestion')
            : question.title[language]}
        {question.text[language] && <ShowMore text={question.text[language]} />}
      </Typography>
    </>
  )
}

const CustomText = ({ control, id, title }) => {
  const { t } = useTranslation()
  return (
    <Box sx={cardStyles.questionsContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ color: 'red' }}>
          {'* '}
        </Typography>
        <Typography component="span">{t(title)}</Typography>
      </Box>
      <Controller
        control={control}
        name={id}
        defaultValue=""
        rules={{ required: true }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <TextField
              helperText={error ? error.message : null}
              data-testid={`question-${id}`}
              onChange={onChange}
              fullWidth
            />
          </Box>
        )}
      />
    </Box>
  )
}

const FacultySelect = ({ control }) => {
  if (ORGANISATION_ID === 'hy') return <SelectFaculty control={control} />
  return <CustomText control={control} id="faculty" title="facultySelect:title" />
}

const UnitSelect = ({ control }) => {
  if (ORGANISATION_ID === 'hy') return <SelectUnit control={control} />
  return <CustomText control={control} id="unit" title="unitSelect:title" />
}

const RenderQuestion = ({ control, watch, question, questions, language }: InputProps) => {
  const { countries, isLoading } = useCountries()
  const { resultData } = useResultData()

  if (isLoading || !question || !questions || !watch || !countries) return null

  const selectedCountry = watch('8')
  const selectedCountryCode = countries.find(country => country.name === selectedCountry)?.iso2Code

  if (question.visibility?.options) {
    const [...options] = question.visibility.options

    if (!question.parentId) return null

    const parent = watch(question.parentId.toString())

    if (typeof parent === 'object') {
      const hasAllValuesSelected = question.visibility.options.some(x => parent.includes(x))

      if (!hasAllValuesSelected) return null
    } else if (!options.includes(parent)) return null
  }

  const components: {
    [key in PossibleChoiceTypes]: (...args: InputProps[]) => JSX.Element | null
  } = {
    singleChoice: SingleChoice,
    multipleChoice: MultiChoice,
    info: SingleChoice,
    text: Text,
    employeeSelect: EmployeeSelect,
    countrySelect: CountrySelect,
    organisationSelect: OrganisationSelect,
    universitySelect: UniversitySelect,
    highRiskCountrySelect: HighRiskCountrySelect,
    noneditable: Info,
  }

  const QuestionType = components[question.optionData.type]

  if (!QuestionType) return null

  const childQuestions = questions.filter(childQuestion => question.id === childQuestion.parentId)

  if (question.id === 3 && ORGANISATION_ID === 'hy')
    return <SelectTuhatProject control={control} question={question} watch={watch} />
  if (question.id === 2 && ORGANISATION_ID !== 'hy') return <UnitSelect control={control} />

  const defaultValue: any = resultData[question.id]

  return (
    <Box>
      <Box sx={cardStyles.questionsContainer}>
        <QuestionText question={question} language={language as keyof Locales} watch={watch} />
        <QuestionType
          key={question.id}
          control={control}
          question={question}
          language={language}
          selectedCountry={selectedCountryCode}
          watch={watch}
          defaultValue={defaultValue ? defaultValue : ''}
        >
          {childQuestions?.map(children => (
            <RenderQuestion
              key={children.id}
              control={control}
              watch={watch}
              question={children}
              questions={questions}
              language={language}
            />
          ))}
        </QuestionType>
      </Box>
      {question.id === 1 && <FacultySelect control={control} />}
      {question.id === 2 && <UnitSelect control={control} />}
    </Box>
  )
}

export default RenderQuestion
