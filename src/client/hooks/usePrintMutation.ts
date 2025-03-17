import { useMutation } from 'react-query'
import apiClient from '../util/apiClient'

export const usePrintMutation = (entryId?: string) => {
  const mutationFn = async (): Promise<Blob> => {
    const response = await apiClient.post(`/entries/${entryId}/pdf`, null, {
      responseType: 'blob',
    })
    return response.data
  }

  const mutation = useMutation<Blob, Error>(mutationFn, {
    onSuccess: () => {},
  })

  return mutation
}
