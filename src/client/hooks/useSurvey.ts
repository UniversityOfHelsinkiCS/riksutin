import { useQuery } from 'react-query'

import type { Survey } from '@frontend/types'

import { DEFAULT_SURVEY_NAME } from '../../config'

import apiClient from '../util/apiClient'

const useSurvey = (name = DEFAULT_SURVEY_NAME) => {
  const queryKey = ['survey', name]

  const query = async (): Promise<Survey> => {
    const { data } = await apiClient.get(`/surveys/${name}`)

    return data
  }

  const { data: survey, ...rest } = useQuery(queryKey, query)

  return { survey, ...rest }
}

export default useSurvey
