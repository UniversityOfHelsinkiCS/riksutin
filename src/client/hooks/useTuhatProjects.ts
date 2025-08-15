import { useQuery } from 'react-query'

import type { TuhatData } from '@types'

import apiClient from '../util/apiClient'

const useTuhatProjects = (projectOwnerId: string) => {
  const queryKey = ['tuhatprojects', projectOwnerId]
  const query = async (): Promise<TuhatData[]> => {
    const { data } = await apiClient.get('/tuhatprojects/', { params: { projectOwnerId } })

    return data
  }

  const { data: tuhatProjects, ...rest } = useQuery(queryKey, query, {
    enabled: Boolean(projectOwnerId),
  })

  return { tuhatProjects, ...rest }
}

export default useTuhatProjects
