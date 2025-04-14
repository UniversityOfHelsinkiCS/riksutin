import { useQuery } from 'react-query'

import apiClient from '../util/apiClient'

const useEmployee = (search: string | undefined) => {
  const queryKey = ['employee', search]

  const query = async () => {
    const { data } = await apiClient.get('/faculties/employees')

    return data
  }

  const { data, ...rest } = useQuery(queryKey, query, {
    enabled: Boolean(search),
  })

  return { data, ...rest }
}

export default useEmployee
