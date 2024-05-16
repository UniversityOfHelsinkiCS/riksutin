import { Entry, Survey, User } from '../db/models'

import { EntryValues } from '../types'

import NotFoundError from '../errors/NotFoundError'
import UnauthorizedError from '../errors/UnauthorizedError'

export const getEntries = async (): Promise<Entry[]> => {
  const entries = await Entry.findAll({
    include: [Survey, User],
    order: [['updatedAt', 'DESC']],
  })

  return entries
}

export const getUserEntries = async (userId: string): Promise<Entry[]> => {
  const entries = await Entry.findAll({
    where: {
      userId,
    },
    include: Survey,
    order: [['updatedAt', 'DESC']],
  })

  if (!entries) throw new NotFoundError('Entries not found')

  return entries
}

export const getEntry = async (
  entryId: string,
  userId: string
): Promise<Entry> => {
  const entry = await Entry.findByPk(entryId, { include: Survey })

  if (!entry) throw new NotFoundError('Entry not found')

  const user = await User.findByPk(userId)

  if (entry.userId !== userId && !user?.isAdmin)
    throw new UnauthorizedError('Unauthorized access')

  return entry
}

export const createEntry = async (
  userId: string,
  surveyId: string,
  body: EntryValues
) => {
  const { sessionToken, data } = body

  const newEntry = await Entry.create({
    surveyId: Number(surveyId),
    userId,
    data,
    sessionToken,
    reminderSent: false,
  })

  return newEntry
}
