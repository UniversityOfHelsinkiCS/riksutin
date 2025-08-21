import { useQuery } from 'react-query'

import type { FacultyOrUnit } from '@types'

import apiClient from '../util/apiClient'

const useUnits = () => {
  const queryKey = 'units'

  const query = async (): Promise<FacultyOrUnit[]> => {
    const { data } = await apiClient.get('/faculties/units')

    return data
  }

  const { data: faculties, ...rest } = useQuery(queryKey, query)

  return { faculties, ...rest }
}

export default useUnits
