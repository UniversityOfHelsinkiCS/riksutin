import { useMutation } from 'react-query'

import { NewResult, UpdatedResult } from '@validators/results'

import useSurvey from './useSurvey'

import apiClient from '../util/apiClient'
import queryClient from '../util/queryClient'

export const useCreateResultMutation = () => {
  const { survey } = useSurvey()

  const mutationFn = async (data: NewResult) => {
    await apiClient.post(`/results/${survey?.id}`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['results', survey?.id],
      }),
  })

  return mutation
}

export const useEditResultMutation = (resultId: number) => {
  const { survey } = useSurvey()

  const mutationFn = async (data: UpdatedResult) => {
    await apiClient.put(`/results/${resultId}`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['results', survey?.id],
      }),
  })

  return mutation
}

export const useDeleteResultMutation = (resultId: number) => {
  const { survey } = useSurvey()

  const mutationFn = async () => {
    await apiClient.delete(`/results/${resultId}`)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['results', survey?.id],
      }),
  })

  return mutation
}
