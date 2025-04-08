import { useQuery } from 'react-query'

import type { Faculty } from '@types'

import apiClient from '../util/apiClient'

const useUnits = () => {
  const queryKey = 'units'

  const query = async (): Promise<Faculty[]> => {
    const { data } = await apiClient.get('/faculties/units')

    return data
  }

  const { data: faculties, ...rest } = useQuery(queryKey, query)

  return { faculties, ...rest }
}

export default useUnits
