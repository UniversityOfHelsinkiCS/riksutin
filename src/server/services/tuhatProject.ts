import type { TuhatData } from '@server/types'
import { inDevelopment, inE2EMode } from '@config'

import { getTuhatData } from '@userservices/organisations'
import mockTuhatProject from '../mocs/tuhatProject'

export const getTuhatProjects = async (projectOwnerId: string): Promise<TuhatData[]> => {
  if (inDevelopment || inE2EMode) {
    if (projectOwnerId) return mockTuhatProject
    return []
  }
  if (projectOwnerId === '') return []
  const tuhatProjects = await getTuhatData(projectOwnerId)

  return tuhatProjects
}
