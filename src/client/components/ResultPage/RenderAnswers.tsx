/* eslint-disable no-nested-ternary */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'

import type { FormValues, Locales } from '@types'
import type { Survey } from '@frontend/types'

import { extraOrganisations } from '../../util/organisations'

import styles from '../../styles'
import useFaculties from '../../hooks/useFaculties'

const { resultStyles } = styles

const RenderAnswers = ({
  survey,
  resultData,
}: {
  survey: Survey
  resultData: FormValues
}) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const { faculties, isLoading: facultiesLoading } = useFaculties()

  if (facultiesLoading || !faculties) return null

  const organisations = faculties.concat(extraOrganisations)

  const multiChoiceQuestions = survey.Questions.filter(
    (question) => question.optionData.type === 'multipleChoice'
  )

  const singleChoiceQuestions = survey.Questions.filter(
    (question) => question.optionData.type === 'singleChoice'
  )

  const singleChoiceAnswers = singleChoiceQuestions.map((question) => {
    const questionId = question.id
    const answer = resultData[questionId]
    const text = question.optionData.options.find((o) => o.id === answer)
      ?.title[language as keyof Locales]

    return { [questionId]: text || '' }
  })

  const multiChoiceAnswers = multiChoiceQuestions.map((question) => {
    const questionId = question.id
    const answer = resultData[questionId]
    const texts = answer.map(
      (value: string) =>
        question.optionData.options.find((option) => option.id === value)
          ?.title[language as keyof Locales]
    )

    return { [questionId]: texts.join(', ') || '' }
  })

  if (resultData.selectOrganisation) {
    // eslint-disable-next-line no-param-reassign
    resultData[22] = resultData.selectOrganisation
  }

  const answers = {
    ...resultData,
    ...Object.assign({}, ...singleChoiceAnswers),
    ...Object.assign({}, ...multiChoiceAnswers),
  }

  return (
    <>
      <Typography variant="h6">{t('results:answerBoxTitle')}</Typography>
      <Box sx={resultStyles.resultElementWrapper}>
        {survey?.Questions.map((currentQuestion) => (
          <Box key={currentQuestion.id}>
            {!currentQuestion.parentId && (
              <>
                <Box sx={resultStyles.card}>
                  <Typography>
                    {currentQuestion.id === 8 &&
                    resultData[4] === 'multilateral' ? (
                      <b>
                        {t(
                          'questions:additionalPartnerOrganisationCountryQuestion'
                        )}
                      </b>
                    ) : currentQuestion.id === 6 &&
                      resultData[4] === 'multilateral' ? (
                      <b>
                        {t(
                          'questions:additionalPartnerOrganisationTypeQuestion'
                        )}
                      </b>
                    ) : (
                      <b>{currentQuestion.title[language as keyof Locales]}</b>
                    )}
                  </Typography>
                  <Typography>
                    {answers[currentQuestion.id] as string}
                  </Typography>
                </Box>
                {survey?.Questions.filter(
                  (childQuestion) =>
                    childQuestion.parentId === currentQuestion.id
                )?.map((childQuestion) => (
                  <Box key={childQuestion.id}>
                    <Box>
                      {answers[childQuestion.id] && (
                        <Box sx={resultStyles.answerBox}>
                          <Typography>
                            <b>
                              {childQuestion.title[language as keyof Locales]}
                            </b>
                          </Typography>
                          <Typography>
                            {childQuestion.id === 26
                              ? answers[childQuestion.id].join(', ')
                              : (answers[childQuestion.id] as string)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </>
            )}
            {currentQuestion.id === 6 && answers[21] && (
              <Box sx={resultStyles.answerBox}>
                <Typography>
                  <b>
                    {
                      survey.Questions.find(
                        (childQuestion) => childQuestion.id === 21
                      )?.title[language as keyof Locales]
                    }
                  </b>
                </Typography>
              </Box>
            )}
            {currentQuestion.id === 1 && (
              <Box sx={resultStyles.card}>
                <Typography>
                  <b>{t('facultySelect:title')}</b>
                </Typography>
                <Typography>
                  {
                    organisations.find(
                      (faculty) => faculty.code === answers.faculty
                    )?.name[language as keyof Locales]
                  }
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </>
  )
}

export default RenderAnswers
