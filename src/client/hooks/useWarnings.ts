import type { Warning } from '@types'

import { useQuery } from 'react-query'

import apiClient from '../util/apiClient'

//import axios from 'axios'

export const useWarnings = () => {
  const queryKey = 'warnings'

  const query = async (): Promise<Warning[]> => {
    const { data } = await apiClient.get('/warnings')

    return data
  }

  const { data: warnings, ...rest } = useQuery(queryKey, query)

  return { warnings, ...rest }
}

//export const createWarning = newWarning =>
//  axios.post("/warnings", newWarning).then(res => res.data)
//
//export const postWarnings = () => {
//  const queryKey = 'warninigs'
//  const mutationFn = async (data: NewWarning) => {
//    await apiClient.post("/warnings", data)
//  }
//
//  return mutationFn
//}

//export default {
//  useWarnings, postWarnings
//}

export default useWarnings
