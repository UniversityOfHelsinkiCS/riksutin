import express from 'express'

import type { RequestWithUser } from '@backend/types'

import { getFaculties, getUserFaculties } from '../services/faculty'

const facultyRouter = express.Router()

facultyRouter.get('/', async (req, res) => {
  const faculties = await getFaculties()

  return res.send(faculties)
})

facultyRouter.get('/user', async (req: RequestWithUser, res: any) => {
  const { id, iamGroups = [] } = req.user

  const faculties = await getUserFaculties(id, iamGroups)

  return res.send(faculties)
})

export default facultyRouter
