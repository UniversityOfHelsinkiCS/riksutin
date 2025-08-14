import { UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@mui/material'

import type { Locales, PossibleChoiceTypes, Question } from '@types'
import type { InputProps } from '@client/types'

import useLoggedInUser from '../../hooks/useLoggedInUser'
import MultiChoice from '../QuestionTypes/MultiChoice'
import SingleChoice from '../QuestionTypes/SingleChoice'
import Text from '../QuestionTypes/Text'
import Info from '../QuestionTypes/Info'
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

const RenderQuestion = ({ control, watch, question, questions, language }: InputProps) => {
  const { countries, isLoading } = useCountries()
  const { user } = useLoggedInUser()

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
    noneditable: Text,
  }

  const QuestionType = components[question.optionData.type]

  if (!QuestionType) return null

  const childQuestions = questions.filter(childQuestion => question.id === childQuestion.parentId)
  if (question.id === 3) return <SelectTuhatProject control={control} question={question} />
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
          defaultValue={question.id === 1 ? `${user?.firstName} ${user?.lastName}` : ''}
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
      {question.id === 1 && <SelectFaculty control={control} />}
      {question.id === 2 && <SelectUnit control={control} />}
    </Box>
  )
}

export default RenderQuestion
