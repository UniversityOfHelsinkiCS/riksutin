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
  //console.log("use1")
  const mutation = useMutation(
    async (newWarning: NewWarning) => {
      await apiClient.post('/warnings', newWarning)
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
      await apiClient.put(`/warnings/${warningObj.id}`, warningObj)
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

export default {
  useWarnings,
  useCreateWarning,
  useDeleteWarning,
  useEditWarning,
}
