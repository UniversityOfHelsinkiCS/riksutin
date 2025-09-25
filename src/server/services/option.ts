import { v4 as uuidv4 } from 'uuid'

import { NewOption, OptionZod, UpdatedOption, UpdatedOptionZod } from '@validators/options'
import { Question, Result } from '@dbmodels'

import NotFoundError from '../errors/NotFoundError'
import ZodValidationError from '../errors/ValidationError'

export const createOption = async (questionId: string, newOptionValues: NewOption): Promise<Question> => {
  const question = await Question.findByPk(questionId)

  if (!question) {
    throw new NotFoundError('Question not found while creating a new option')
  }

  const request = OptionZod.safeParse(newOptionValues)

  if (!request.success) {
    throw new ZodValidationError('Validation of the new option inputs failed', request.error.issues)
  }

  const { data } = request

  const optionId = uuidv4()
  const newOption = {
    ...data,
    id: optionId,
    label: optionId,
  }

  question.optionData.options = [...question.optionData.options, newOption]

  question.changed('optionData', true)

  await question.save()

  return question
}

export const updateOption = async (
  questionId: string,
  optionId: string,
  updatedOptionValues: UpdatedOption
): Promise<Question> => {
  const question = await Question.findByPk(questionId)

  if (!question) {
    throw new NotFoundError('Question not found while updating a option')
  }

  const option = question.optionData.options.find(aOption => aOption.id === optionId)

  if (!option) {
    throw new NotFoundError('Option to update not found')
  }

  const request = UpdatedOptionZod.safeParse(updatedOptionValues)

  if (!request.success) {
    throw new ZodValidationError('Validation of the updated option inputs failed', request.error.issues)
  }

  const { data } = request

  const updates = question.optionData.options.map(aOption =>
    aOption.id === optionId ? Object.assign(option, data) : aOption
  )

  Object.assign(question, updates)

  question.changed('optionData', true)

  await question.save()

  return question
}

export const deleteOption = async (questionId: string, optionId: string): Promise<Question> => {
  const question = await Question.findByPk(questionId)

  if (!question) {
    throw new NotFoundError('Question not found while deleting a option')
  }

  const option = question.optionData.options.find(aOption => aOption.id === optionId)

  if (!option) {
    throw new NotFoundError('Option to delete not found')
  }

  const updates = question.optionData.options.filter(aOption => aOption.id !== optionId)

  question.optionData.options = updates

  question.changed('optionData', true)

  await question.save()

  // Remove all the results also associated with the option
  await Result.destroy({
    where: {
      optionLabel: option.label,
    },
  })

  return question
}
