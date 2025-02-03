import { useQuery } from 'react-query'

import { Question } from '@types'

import apiClient from '../util/apiClient'

const useQuestions = (surveyId: number | undefined) => {
  const queryKey = ['questions', surveyId]

  const query = async (): Promise<Question[]> => {
    const { data } = await apiClient.get(`/questions/${surveyId}`)

    return data
  }

  const { data: questions, ...rest } = useQuery(queryKey, query, {
    enabled: Boolean(surveyId),
  })

  return { questions, ...rest }
}

export default useQuestions
