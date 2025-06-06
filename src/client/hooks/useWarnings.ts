import type { Warning, NewWarning } from '@types'

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

export const createWarning = async (warningObj: NewWarning) => {
  //const queryKey = 'warninigs'
  const obj = await apiClient.post('/warnings', warningObj)
  return obj
}

export const deleteWarning = async (warningId: number) => {
  try {
    const obj = await apiClient.delete(`/warnings/${warningId}`)

    return obj
  } catch (er) {
    return { error: er, er }
  }
}

export default {
  useWarnings,
  createWarning,
  deleteWarning,
}

//export default useWarnings
