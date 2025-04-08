import express from 'express'

import type { RequestWithUser } from '@server/types'

import { getFaculties, getUserFaculties, getEmployees, getUnits } from '../services/faculty'

const facultyRouter = express.Router()

facultyRouter.get('/', async (req, res) => {
  const faculties = await getFaculties()

  return res.send(faculties)
})

facultyRouter.get('/units', async (req, res) => {
  const units = await getUnits()

  return res.send(units)
})

facultyRouter.get('/user', async (req: RequestWithUser, res: any) => {
  const { id, iamGroups = [] } = req.user

  const faculties = await getUserFaculties(id, iamGroups)

  return res.send(faculties)
})

facultyRouter.get<never, any[], never, { search: string }>('/employees', async (req, res) => {
  const { search = '' } = req.query
  const employees = await getEmployees(search)

  return res.send(employees)
})

export default facultyRouter
