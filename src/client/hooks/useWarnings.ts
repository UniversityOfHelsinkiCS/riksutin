import type { Warning } from '@types'

import { useQuery } from 'react-query'

import apiClient from '../util/apiClient'

const useWarnings = () => {
  const queryKey = 'warnings'

  const query = async (): Promise<Warning[]> => {
    const { data } = await apiClient.get('/warnings')

    return data
  }

  const { data: warnings, ...rest } = useQuery(queryKey, query)

  return { warnings, ...rest }
}

export default useWarnings
