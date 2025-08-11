import type { TuhatData } from '@server/types'
import { inDevelopment, inE2EMode } from '@config'

import { getTuhatData } from '@userservices/organisations'
import mockTuhatProject from '../mocs/tuhatProject'

export const getTuhatProjects = async (userId: string): Promise<TuhatData[]> => {
  if (inDevelopment || inE2EMode) return mockTuhatProject

  const tuhatProjects = await getTuhatData(userId)

  return tuhatProjects
}
