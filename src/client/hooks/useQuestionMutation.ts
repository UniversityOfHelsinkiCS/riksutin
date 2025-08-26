import { useMutation } from 'react-query'

import { NewQuestion, UpdatedQuestion, UpdatedQuestionLocation } from '@validators/questions'

import apiClient from '../util/apiClient'
import queryClient from '../util/queryClient'
import useSurvey from './useSurvey'

export const useCreateQuestionMutation = () => {
  const { survey } = useSurvey()

  const mutationFn = async (data: NewQuestion) => {
    await apiClient.post(`/questions/${survey?.id}`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}

export const useEditQuestionMutation = (questionId: number) => {
  const { survey } = useSurvey()

  const mutationFn = async (data: UpdatedQuestion) => {
    await apiClient.put(`/questions/${questionId}`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}

export const useEditQuestionPriorityMutation = (questionId: number | undefined) => {
  const { survey } = useSurvey()

  const mutationFn = async (data: UpdatedQuestionLocation) => {
    await apiClient.put(`/questions/${questionId}/location`, data)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}

export const useDeleteQuestionMutation = (questionId: number) => {
  const { survey } = useSurvey()

  const mutationFn = async () => {
    await apiClient.delete(`/questions/${questionId}`)
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['questions', survey?.id],
      }),
  })

  return mutation
}
