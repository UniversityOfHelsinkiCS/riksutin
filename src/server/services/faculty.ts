import type { FacultyOrUnit } from '@types'
import { inDevelopment, inE2EMode } from '@config'
import mockFaculty from '../mocs/faculty'
import mockUnit from '../mocs/unit'
import mockEmployee from '../mocs/employee'

import {
  getUnitData,
  getOrganisationData,
  getOrganisationEmployeeData,
  getUserOrganisations,
} from '../util/organisations'

export const getUnits = async (): Promise<FacultyOrUnit[]> => {
  if (inDevelopment || inE2EMode) {
    return mockUnit
  }

  const unitData = (await getUnitData()) || []

  return unitData.map(({ code, name }) => ({ code, name }))
}

export const getFaculties = async (): Promise<FacultyOrUnit[]> => {
  if (inDevelopment || inE2EMode) {
    return mockFaculty
  }

  const organisationData = (await getOrganisationData()) || []

  const faculties = organisationData.map(({ code, name }) => ({ code, name }))

  return faculties
}

export const getUserFaculties = async (userId: string, iamGroups: string[]): Promise<FacultyOrUnit[]> => {
  if (inDevelopment || inE2EMode) {
    return mockFaculty
  }

  if (!userId) {
    return []
  }

  const organisationData = await getUserOrganisations(userId, iamGroups)

  return organisationData.map(({ code, name }) => ({ code, name }))
}

export const getEmployees = async (search: string) => {
  if (inDevelopment || inE2EMode) {
    return mockEmployee
  }

  return (await getOrganisationEmployeeData(search)) || []
}
