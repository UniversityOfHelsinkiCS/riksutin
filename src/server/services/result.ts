import { NewResult, NewResultZod, UpdatedResult, UpdatedResultZod } from '@validators/results'
import { Result, Survey } from '@dbmodels'

import NotFoundError from '../errors/NotFoundError'
import ZodValidationError from '../errors/ValidationError'

export const getResults = async (surveyId: string): Promise<Result[]> => {
  const results = await Result.findAll({
    where: {
      surveyId,
    },
  })

  return results
}

export const createResult = async (surveyId: string, newResultValues: NewResult): Promise<Result> => {
  const survey = await Survey.findByPk(surveyId)

  if (!survey) {
    throw new NotFoundError('Survey not found while creating a new result')
  }

  const request = NewResultZod.safeParse(newResultValues)

  if (!request.success) {
    throw new ZodValidationError('Validation of the new result inputs failed', request.error.issues)
  }

  const { data } = request

  const newResult = await Result.create({
    surveyId: Number(surveyId),
    ...data,
  })

  return newResult
}

export const updateResult = async (resultId: string, updatedResultValues: UpdatedResult): Promise<Result> => {
  const result = await Result.findByPk(resultId)

  if (!result) throw new NotFoundError('Result to update not found')

  const request = UpdatedResultZod.safeParse(updatedResultValues)

  if (!request.success) {
    throw new ZodValidationError('Validation of the update result inputs failed', request.error.issues)
  }

  const { data } = request

  Object.assign(result, data)
  await result.save()

  return result
}

export const deleteResult = async (resultId: string): Promise<Result> => {
  const result = await Result.findByPk(resultId)

  if (!result) throw new NotFoundError('Result to delete not found')

  await result.destroy()

  return result
}
