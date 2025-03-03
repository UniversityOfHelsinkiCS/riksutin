import type { Faculty } from '@types'
import { inDevelopment, inE2EMode } from '@config'
import mockFaculty from '../mocs/faculty'

import { getOrganisationData, getUserOrganisations } from '../util/organisations'

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
