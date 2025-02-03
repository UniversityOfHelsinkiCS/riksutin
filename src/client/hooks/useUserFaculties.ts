import { useQuery } from 'react-query'

import { Faculty } from '@types'

import apiClient from '../util/apiClient'

const useUserFaculties = () => {
  const queryKey = 'userFaculties'

  const query = async (): Promise<Faculty[]> => {
    const { data } = await apiClient.get('/faculties/user')

    return data
  }

  const { data: userFaculties, ...rest } = useQuery(queryKey, query)

  return { userFaculties, ...rest }
}

export default useUserFaculties
