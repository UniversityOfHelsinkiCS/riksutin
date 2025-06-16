import type { Warning, NewWarning } from '@types'

import { useQuery, useMutation } from 'react-query'

import apiClient from '../util/apiClient'
import queryClient from '../util/queryClient'

export const useWarnings = () => {
  const queryKey = 'warnings'
  const query = async (): Promise<Warning[]> => {
    const { data } = await apiClient.get('/warnings')

    return data
  }
  const { data: warnings, ...rest } = useQuery(queryKey, query)
  return { warnings, ...rest }
}

export const useCreateWarning = () => {
  const mutation = useMutation(
    async (newWarning: NewWarning) => {
      return apiClient.post('/warnings', newWarning)
    },
    {
      onSuccess: () => {
        // eslint-disable-next-line
        queryClient.invalidateQueries({ queryKey: ['warnings'] })
      },
      onError(error: any) {
        return error
      },
    }
  )
  return mutation
}

export const useDeleteWarning = () => {
  const mutation = useMutation(
    async (warningId: string) => {
      await apiClient.delete(`/warnings/${warningId}`)
    },
    {
      onSuccess: () => {
        // eslint-disable-next-line
        queryClient.invalidateQueries({ queryKey: ['warnings'] })
      },
    }
  )
  return mutation
}

export const useEditWarning = () => {
  const mutation = useMutation(
    async (warningObj: Warning) => {
      return apiClient.put(`/warnings/${warningObj.id}`, warningObj)
    },
    {
      onSuccess: () => {
        // eslint-disable-next-line
        queryClient.invalidateQueries({ queryKey: ['warnings'] })
      },
      onError(error: any) {
        return error
      },
    }
  )
  return mutation
}

export default {
  useWarnings,
  useCreateWarning,
  useDeleteWarning,
  useEditWarning,
}
