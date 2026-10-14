import express from 'express'

import type { RequestWithUser } from '@server/types'

import { getFaculties, getUserFaculties, getEmployees, cacheUnits } from '../services/faculty'
import { ensureAuthenticated } from '../middleware/user'

import adminHandler from '../middleware/admin'
import { get, getPermanent } from '../util/redis'

const facultyRouter = express.Router()

facultyRouter.get('/cache/flush', adminHandler, async (req, res) => {
  await cacheUnits()

  return res.status(200).send({ status: 'OK' })
})

facultyRouter.get('/', async (req, res) => {
  const faculties = await getFaculties()

  return res.send(faculties)
})

facultyRouter.get('/units', async (req, res) => {
  let cached = await get('units')
  cached ??= await getPermanent('units')

  if (cached) {
    return res.send(cached)
  }

  const units = await cacheUnits()

  return res.send(units)
})

facultyRouter.get('/user', ensureAuthenticated, async (req: RequestWithUser, res: any) => {
  const { id, iamGroups = [] } = req.user

  const faculties = await getUserFaculties(id, iamGroups)

  return res.send(faculties)
})

facultyRouter.get<never, any[], never, { search: string }>('/employees', ensureAuthenticated, async (req, res) => {
  const { search = '' } = req.query
  const employees = await getEmployees(search)

  return res.send(employees as any)
})

export default facultyRouter
