import { useQuery } from 'react-query'

import type { FacultyOrUnit } from '@types'

import apiClient from '../util/apiClient'

const useFaculties = () => {
  const queryKey = 'faculties'

  const query = async (): Promise<FacultyOrUnit[]> => {
    const { data } = await apiClient.get('/faculties')

    return data
  }

  const { data: faculties, ...rest } = useQuery(queryKey, query)

  return { faculties, ...rest }
}

export default useFaculties
