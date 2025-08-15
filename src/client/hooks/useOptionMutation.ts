import { useMutation } from 'react-query'

import type { Locales } from '@types'
import { NewOption } from '@validators/options'

import useSurvey from './useSurvey'

import apiClient from '../util/apiClient'
import queryClient from '../util/queryClient'

type OptionUpdates = {
  title: Locales
  data?: Locales
}

export const useCreateOptionMutation = (questionId: number) => {
  const { survey } = useSurvey()

  const mutationFn = async (data: NewOption) => {
    await apiClient.post(`/questions/${questionId}/option/`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}

export const useEditOptionMutation = (questionId: number, optionId: string) => {
  const { survey } = useSurvey()

  const mutationFn = async (data: OptionUpdates) => {
    await apiClient.put(`/questions/${questionId}/option/${optionId}`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}

export const useDeleteOptionMutation = (questionId: number, optionId: string) => {
  const { survey } = useSurvey()

  const mutationFn = async () => {
    await apiClient.delete(`/questions/${questionId}/option/${optionId}`)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}
