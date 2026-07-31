import express from 'express'

import type { RequestWithUser } from '@server/types'

import { getFaculties, getUserFaculties, getEmployees, getUnits } from '../services/faculty'
import { ensureAuthenticated } from '../middleware/user'

import { get, getPermanent, setPermanent } from '../util/redis'

const facultyRouter = express.Router()

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

  const units = await getUnits()
  await setPermanent('units', units)

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
