import { v4 as uuidv4 } from 'uuid'
import { useMutation } from 'react-query'

import { SESSION_TOKEN } from '@config'

import { Entry } from '@dbmodels'
import type { FormValues } from '@types'

import apiClient from '../util/apiClient'

export const useSaveEntryMutation = (surveyId: number | undefined) => {
  const mutationFn = async (data: FormValues) => {
    let sessionToken = sessionStorage.getItem(SESSION_TOKEN)

    if (!sessionToken) {
      const sessionId = uuidv4()
      sessionStorage.setItem(SESSION_TOKEN, sessionId)
      sessionToken = sessionId
    }

    const entry: Entry = await apiClient.post(`/entries/${surveyId}`, {
      data,
      sessionToken,
    })

    return entry
  }

  const mutation = useMutation(mutationFn)

  return mutation
}

export const useUpdateEntryRisks = () => {
  const mutationFn = async (entryId: string) => {
    await apiClient.get(`/entries/${entryId}/update`)
  }
  const mutation = useMutation(mutationFn)

  return mutation
}
