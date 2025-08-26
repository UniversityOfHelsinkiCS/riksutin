import { UpdatedSurveyInfo, UpdatedSurveyInfoZod } from '@validators/survey'
import { Question, Survey } from '@dbmodels'

import NotFoundError from '../errors/NotFoundError'
import ZodValidationError from '../errors/ValidationError'

const sortByPriority = (a: Question, b: Question) => a.priority - b.priority

export const getSurvey = async (surveyName: string): Promise<Survey> => {
  const survey = await Survey.findOne({
    where: {
      name: surveyName,
    },
    include: {
      model: Question,
    },
  })

  if (!survey) throw new NotFoundError('Survey not found')

  survey.Questions = survey.Questions.sort(sortByPriority)

  return survey
}

export const updateSurvey = async (surveyName: string, updates: UpdatedSurveyInfo): Promise<Survey> => {
  const survey = await Survey.findOne({
    where: {
      name: surveyName,
    },
    include: {
      model: Question,
    },
  })

  if (!survey) throw new NotFoundError('Survey to update not found')

  const request = UpdatedSurveyInfoZod.safeParse(updates)

  if (!request.success) {
    throw new ZodValidationError('Validation of the update result inputs failed', request.error.issues)
  }

  const { data } = request

  Object.assign(survey, data)

  await survey.save()

  return survey
}
