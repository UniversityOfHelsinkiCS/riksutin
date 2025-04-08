import type { Faculty } from '@types'
import { inDevelopment, inE2EMode } from '@config'
import mockFaculty from '../mocs/faculty'
import mockEmployee from '../mocs/employee'

import {
  getUnitData,
  getOrganisationData,
  getOrganisationEmployeeData,
  getUserOrganisations,
} from '../util/organisations'

export const getUnits = async (): Promise<Faculty[]> => {
  if (inDevelopment || inE2EMode) return mockFaculty

  const unitData = (await getUnitData()) || []

  const units = unitData.map(({ code, name }) => ({ code, name }))

  return units
}

export const getFaculties = async (): Promise<Faculty[]> => {
  if (inDevelopment || inE2EMode) return mockFaculty

  const organisationData = (await getOrganisationData()) || []

  const faculties = organisationData.map(({ code, name }) => ({ code, name }))

  return faculties
}

export const getUserFaculties = async (userId: string, iamGroups: string[]): Promise<Faculty[]> => {
  if (inDevelopment || inE2EMode) return mockFaculty

  if (!userId) return []

  const organisationData = await getUserOrganisations(userId, iamGroups)

  const faculties = organisationData.map(({ code, name }) => ({ code, name }))

  return faculties
}

export const getEmployees = async (search: string) => {
  if (inDevelopment || inE2EMode) return mockEmployee

  const employeeData = (await getOrganisationEmployeeData(search)) || []

  return employeeData
}
