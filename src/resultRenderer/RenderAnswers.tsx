// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'

import type { FacultyOrUnit, FormValues, Locales } from '@types'
import type { Survey } from '@client/types'

import { extraOrganisations } from '@common/organisations'

import { useComponents } from './context'

const RenderAnswers = ({
  survey,
  resultData,
  faculties,
  units,
  changedFields,
}: {
  survey: Survey
  resultData: FormValues
  faculties: FacultyOrUnit[]
  units: FacultyOrUnit[]
  changedFields?: Set<number>
}) => {
  const { Div, Typography, t, language } = useComponents()

  const organisations = faculties.concat(extraOrganisations)

  const multiChoiceQuestions = survey.Questions.filter(question => question.optionData.type === 'multipleChoice')

  const singleChoiceQuestions = survey.Questions.filter(question => question.optionData.type === 'singleChoice')

  const singleChoiceAnswers = singleChoiceQuestions.map(question => {
    const questionId = question.id
    const answer = resultData[questionId]
    const text = question.optionData.options.find(o => o.id === answer)?.title[language as keyof Locales]

    return { [questionId]: text ?? '' }
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

  const unit = units.find(faculty => faculty.code === answers.unit)
  const parsedUnit = unit ? `${unit.code} - ${unit.name[language as keyof Locales]}` : answers.unit

  const hyCordinatedMultilateral = resultData['9'] === 'coordinator' && resultData['4'] === 'multilateral'

  const arrayToString = answers => {
    if (answers.length === 0) {
      return t('results:selectionEmpty')
    }
    return answers.join(', ')
  }

  return (
    <>
      <Typography variant="h6" style={{ fontSize: '24px', marginBottom: '20px' }}>
        {t('results:answerBoxTitle')}
      </Typography>
      {changedFields && changedFields.size > 0 && (
        <Div style={{ backgroundColor: '#fffef0', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          <Typography style={{ fontSize: '14px', fontStyle: 'italic' }}>{t('results:changedFieldsNote')}</Typography>
        </Div>
      )}
      <Div style={{ borderLeft: '1px solid lightgray' }}>
        {survey?.Questions.map(currentQuestion => (
          <Div key={currentQuestion.id}>
            {!currentQuestion.parentId && !(hyCordinatedMultilateral && [6, 8, 24].includes(currentQuestion.id)) && (
              <>
                <Div
                  style={{
                    margin: '16px',
                    ...(changedFields?.has(currentQuestion.id)
                      ? { backgroundColor: '#fffef0', padding: '8px', borderRadius: '4px' }
                      : {}),
                  }}
                  id={`question-${currentQuestion.id}`}
                >
                  <Typography style={{ fontWeight: '800' }}>
                    {currentQuestion.id === 8 && resultData[4] === 'multilateral'
                      ? t('questions:additionalPartnerOrganisationCountryQuestion')
                      : currentQuestion.id === 6 && resultData[4] === 'multilateral'
                        ? t('questions:additionalPartnerOrganisationTypeQuestion')
                        : currentQuestion.title[language as keyof Locales]}
                  </Typography>
                  <Typography>
                    {answers[currentQuestion.id] &&
                    currentQuestion.id === 2 &&
                    typeof answers[currentQuestion.id] === 'object' &&
                    !Array.isArray(answers[currentQuestion.id])
                      ? `${answers[currentQuestion.id].firstName} ${answers[currentQuestion.id].lastName} (${answers[currentQuestion.id].email})`
                      : ((answers[currentQuestion.id] as string) ?? '')}
                  </Typography>
                </Div>
                {survey?.Questions.filter(
                  childQuestion =>
                    childQuestion.parentId === currentQuestion.id &&
                    !(hyCordinatedMultilateral && [6, 8, 24].includes(childQuestion.id)) &&
                    !(!hyCordinatedMultilateral && [26, 27, 28, 30].includes(childQuestion.id))
                )?.map(childQuestion => (
                  <Div key={childQuestion.id} style={{ margin: '16px' }}>
                    <Div style={{ borderLeft: '1px solid lightgray' }}>
                      {answers[childQuestion.id] && (
                        <Div style={{ margin: '16px' }}>
                          <Typography style={{ fontWeight: '800' }}>
                            {childQuestion.title[language as keyof Locales]}
                          </Typography>
                          <Typography>
                            {[26, 28].includes(childQuestion.id)
                              ? arrayToString(answers[childQuestion.id])
                              : (answers[childQuestion.id] as string)}
                          </Typography>
                        </Div>
                      )}
                    </Div>
                  </Div>
                ))}
              </>
            )}
            {currentQuestion.id === 6 && answers[21] && (
              <Div style={{ margin: '16px' }}>
                <Typography style={{ fontWeight: '800' }}>
                  {survey.Questions.find(childQuestion => childQuestion.id === 21)?.title[language as keyof Locales]}
                </Typography>
              </Div>
            )}
            {currentQuestion.id === 1 && (
              <Div style={{ margin: '16px' }}>
                <Typography style={{ fontWeight: '800' }}>{t('facultySelect:title')}</Typography>
                <Typography>
                  {organisations.find(faculty => faculty.code === answers.faculty)?.name[language as keyof Locales]}
                </Typography>
              </Div>
            )}
            {currentQuestion.id === 2 && (
              <Div style={{ margin: '16px' }} id="question-3">
                <Typography style={{ fontWeight: '800' }}>{t('unitSelect:title')}</Typography>
                <Typography>{parsedUnit}</Typography>
              </Div>
            )}
          </Div>
        ))}
      </Div>
    </>
  )
}

export default RenderAnswers
