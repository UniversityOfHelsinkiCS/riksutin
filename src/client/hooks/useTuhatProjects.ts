import { useQuery } from 'react-query'

import type { tuhatProject } from '@types'

import apiClient from '../util/apiClient'

const useTuhatProjects = () => {
  const queryKey = 'tuhatprojects'

  const query = async (): Promise<tuhatProject[]> => {
    const { data } = await apiClient.get('/tuhatprojects')

    return data
  }

  const { data: tuhatProjects, ...rest } = useQuery(queryKey, query)

  return { tuhatProjects, ...rest }
}

export default useTuhatProjects
