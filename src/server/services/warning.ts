import { NewWarning, NewWarningZod, UpdatedWarning, UpdatedWarningZod } from '@validators/warning'

import { Warning } from '@dbmodels'
import NotFoundError from '../errors/NotFoundError'
import ZodValidationError from '../errors/ValidationError'
//import { DataTypes } from 'sequelize'

export const getWarnings = async (): Promise<Warning[]> => {
  const results = await Warning.findAll({})

  return results
}

export const getWarningWithId = async (id: number): Promise<Warning[]> => {
  //console.log("test1")

  const result = await Warning.findAll({
    where: {
      id,
    },
  })
  return result
}

export const createWarning = async (newWarningValues: NewWarning): Promise<Warning> => {
  const request = NewWarningZod.safeParse(newWarningValues)

  if (!request.success) throw new ZodValidationError('Validation of the new result inputs failed', request.error.issues)

  const newWarning = await Warning.create({
    id: newWarningValues.id,
    country: newWarningValues.country,
    text: {
      fi: newWarningValues.text.fi,
      en: newWarningValues.text.en,
    },
    expiry_date: new Date(),
    //expiry_date: new Date('2025-12-31T23:59:59Z')
    //expiry_date: new Date(newWarningValues.expiry_date)
  })
  return newWarning
}

export const deleteWarning = async (warningId: string): Promise<Warning> => {
  const warning = await Warning.findByPk(warningId)

  if (!warning) throw new NotFoundError('No warning with this id')
  await warning.destroy()
  return warning
}

export const updateWarning = async (warningId: string, updatedWarningValues: UpdatedWarning): Promise<Warning> => {
  const warning = await Warning.findByPk(warningId)

  if (!warning) throw new NotFoundError('Question to update not found')

  const request = UpdatedWarningZod.safeParse(updatedWarningValues)

  if (!request.success)
    throw new ZodValidationError('Validation of the warning update values failed', request.error.issues)
  const { data } = request

  Object.assign(warning, data)

  await warning.save()

  return warning
}
