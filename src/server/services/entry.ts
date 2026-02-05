import type { EntryValues } from '@server/types'

import { Entry, Survey, User, ControlReport } from '@dbmodels'
import { Op } from 'sequelize'

import NotFoundError from '../errors/NotFoundError'
import UnauthorizedError from '../errors/UnauthorizedError'
import { EmployeeResponse } from '@routes/types'

export const getEntries = async (): Promise<Entry[]> => {
  const entries = await Entry.findAll({
    include: [
      Survey,
      User,
      {
        model: ControlReport,
        as: 'controlReports',
      },
    ],
    order: [['createdAt', 'DESC']],
  })

  return entries
}

export const getUserEntries = async (userId: string): Promise<Entry[]> => {
  const entries = await Entry.findAll({
    where: {
      [Op.or]: [{ userId }, { ownerId: userId }],
    },
    include: [
      Survey,
      {
        model: ControlReport,
        as: 'controlReports',
      },
    ],
    order: [['createdAt', 'DESC']],
  })

  if (!entries) {
    throw new NotFoundError('Entries not found')
  }

  return entries
}

export const getEntry = async (entryId: string, userId: string): Promise<Entry> => {
  const entry = await Entry.findByPk(entryId, {
    include: [
      Survey,
      {
        model: ControlReport,
        as: 'controlReports',
      },
    ],
  })

  if (!entry) {
    throw new NotFoundError('Entry not found')
  }

  const user = await User.findByPk(userId)

  if (entry.userId !== userId && entry.ownerId !== userId && !user?.isAdmin) {
    throw new UnauthorizedError('Unauthorized access')
  }

  return entry
}

export const createEntry = async (userId: string, surveyId: string, body: EntryValues) => {
  const { sessionToken, data, tuhatData, testVersion } = body

  let ownerId = ''
  if (!data.answers['2']) {
    ownerId = userId
  } else {
    const { username, firstName, lastName, email }: EmployeeResponse = data.answers['2']

    ownerId =
      (
        await User.findOne({
          where: {
            id: username,
          },
        })
      )?.id ??
      (
        await User.create({
          id: username,
          username,
          firstName,
          lastName,
          email,
          language: '',
          lastLoggedIn: new Date(),
          isAdmin: false,
        })
      ).id
  }

  const newEntry = await Entry.create({
    surveyId: Number(surveyId),
    userId,
    ownerId,
    data,
    sessionToken,
    reminderSent: false,
    tuhatData,
    testVersion,
  })

  return newEntry
}
