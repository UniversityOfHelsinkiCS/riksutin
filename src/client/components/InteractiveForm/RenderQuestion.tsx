/* eslint-disable no-nested-ternary */
import React from 'react'
import { UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@mui/material'

import type { Locales, PossibleChoiceTypes, Question } from '@types'
import type { InputProps } from '@client/types'

import useLoggedInUser from '../../hooks/useLoggedInUser'
import MultiChoice from '../QuestionTypes/MultiChoice'
import SingleChoice from '../QuestionTypes/SingleChoice'
import Text from '../QuestionTypes/Text'
import ShowMore from '../Common/ShowMore'

import styles from '../../styles'
import useCountries from '../../hooks/useCountries'
import SelectFaculty from '../Common/SelectFaculty'
import OrganisationSelect from '../QuestionTypes/OrganisationSelect'
import UniversitySelect from '../QuestionTypes/UniversitySelect'
import HighRiskCountrySelect from '../QuestionTypes/HighRiskCountriesSelect'
import CountrySelect from '../QuestionTypes/CountrySelect'

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
        {![7, 26].includes(question.id) && '* '}
      </Typography>
      <Typography component="span">
        {question.id === 8 && watch('4') === 'multilateral'
          ? t('questions:additionalPartnerOrganisationCountryQuestion')
          : question.id === 6 && watch('4') === 'multilateral'
          ? t('questions:additionalPartnerOrganisationTypeQuestion')
          : question.title[language as keyof Locales]}
        {question.text[language as keyof Locales] && (
          <ShowMore text={question.text[language as keyof Locales]} />
        )}
      </Typography>
    </>
  )
}

const RenderQuestion = ({
  control,
  watch,
  question,
  questions,
  language,
}: InputProps) => {
  const { countries, isLoading } = useCountries()
  const { user } = useLoggedInUser()

  if (isLoading || !question || !questions || !watch || !countries) return null

  const selectedCountry = watch('8')
  const selectedCountryCode = countries.find(
    (country) => country.name === selectedCountry
  )?.iso2Code

  if (question.visibility?.options) {
    const [...options] = question.visibility.options

    if (!question.parentId) return null

    const parent = watch(question.parentId.toString())

    if (typeof parent === 'object') {
      const hasAllValuesSelected = question.visibility.options.some((x) =>
        parent.includes(x)
      )

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
    countrySelect: CountrySelect,
    organisationSelect: OrganisationSelect,
    universitySelect: UniversitySelect,
    highRiskCountrySelect: HighRiskCountrySelect,
  }

  const QuestionType =
    components[question.optionData.type as PossibleChoiceTypes]

  if (!QuestionType) return null

  const childQuestions = questions.filter(
    (childQuestion) => question.id === childQuestion.parentId
  )
  return (
    <Box>
      <Box sx={cardStyles.questionsContainer}>
        <QuestionText
          question={question}
          language={language as keyof Locales}
          watch={watch}
        />
        <QuestionType
          key={question.id}
          control={control}
          question={question}
          language={language}
          selectedCountry={selectedCountryCode}
          watch={watch}
          defaultValue={
            question.id === 1 ? `${user?.firstName} ${user?.lastName}` : ''
          }
        >
          {childQuestions &&
            childQuestions.map((children) => (
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
    </Box>
  )
}

export default RenderQuestion
