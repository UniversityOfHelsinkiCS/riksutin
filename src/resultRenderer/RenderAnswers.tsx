// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'

import type { FormValues, Locales } from '@types'
import type { Survey } from '@client/types'

import { extraOrganisations } from '@domain/organisations'

import styles from './styles'
import { useComponents } from './context'

const { resultStyles } = styles

const RenderAnswers = ({
  survey,
  resultData,
  faculties,
}: {
  survey: Survey
  resultData: FormValues
  faculties: any
}) => {
  const { Div, Typography, t, language } = useComponents()

  const organisations = faculties.concat(extraOrganisations)

  const multiChoiceQuestions = survey.Questions.filter(question => question.optionData.type === 'multipleChoice')

  const singleChoiceQuestions = survey.Questions.filter(question => question.optionData.type === 'singleChoice')

  const singleChoiceAnswers = singleChoiceQuestions.map(question => {
    const questionId = question.id
    const answer = resultData[questionId]
    const text = question.optionData.options.find(o => o.id === answer)?.title[language as keyof Locales]

    return { [questionId]: text || '' }
  })

  const multiChoiceAnswers = multiChoiceQuestions.map(question => {
    const questionId = question.id
    const answer = resultData[questionId]
    const texts = answer.map(
      (value: string) =>
        question.optionData.options.find(option => option.id === value)?.title[language as keyof Locales]
    )

    return { [questionId]: texts.join(', ') || '' }
  })

  if (resultData.selectOrganisation) {
    resultData[22] = resultData.selectOrganisation
  }

  const answers = {
    ...resultData,
    ...Object.assign({}, ...singleChoiceAnswers),
    ...Object.assign({}, ...multiChoiceAnswers),
  }

  return (
    <>
      <Typography variant="h6" style={{ fontSize: '24px', marginBottom: '20px' }}>
        {t('results:answerBoxTitle')}
      </Typography>
      <Div style={resultStyles.resultElementWrapper}>
        {survey?.Questions.map(currentQuestion => (
          <Div key={currentQuestion.id}>
            {!currentQuestion.parentId && (
              <>
                <Div style={resultStyles.card}>
                  <Typography style={{ fontWeight: '800' }}>
                    {currentQuestion.id === 8 && resultData[4] === 'multilateral'
                      ? t('questions:additionalPartnerOrganisationCountryQuestion')
                      : currentQuestion.id === 6 && resultData[4] === 'multilateral'
                        ? t('questions:additionalPartnerOrganisationTypeQuestion')
                        : currentQuestion.title[language as keyof Locales]}
                  </Typography>
                  <Typography>{answers[currentQuestion.id] as string}</Typography>
                </Div>
                {survey?.Questions.filter(childQuestion => childQuestion.parentId === currentQuestion.id)?.map(
                  childQuestion => (
                    <Div key={childQuestion.id}>
                      <Div>
                        {answers[childQuestion.id] && (
                          <Div style={resultStyles.answerBox}>
                            <Typography style={{ fontWeight: '800' }}>
                              {childQuestion.title[language as keyof Locales]}
                            </Typography>
                            <Typography>
                              {childQuestion.id === 26
                                ? answers[childQuestion.id].join(', ')
                                : (answers[childQuestion.id] as string)}
                            </Typography>
                          </Div>
                        )}
                      </Div>
                    </Div>
                  )
                )}
              </>
            )}
            {currentQuestion.id === 6 && answers[21] && (
              <Div style={resultStyles.answerBox}>
                <Typography style={{ fontWeight: '800' }}>
                  {survey.Questions.find(childQuestion => childQuestion.id === 21)?.title[language as keyof Locales]}
                </Typography>
              </Div>
            )}
            {currentQuestion.id === 1 && (
              <Div style={resultStyles.card}>
                <Typography style={{ fontWeight: '800' }}>{t('facultySelect:title')}</Typography>
                <Typography>
                  {organisations.find(faculty => faculty.code === answers.faculty)?.name[language as keyof Locales]}
                </Typography>
              </Div>
            )}
          </Div>
        ))}
      </Div>
    </>
  )
}

export default RenderAnswers
