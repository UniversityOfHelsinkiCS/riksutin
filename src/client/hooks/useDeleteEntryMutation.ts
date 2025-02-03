import { useMutation } from 'react-query'

import apiClient from '../util/apiClient'
import queryClient from '../util/queryClient'

const useDeleteEntryMutation = () => {
  const queryKey = 'entries'

  const mutationFn = async (entryId: string) => {
    const res = await apiClient.delete(`/entries/${entryId}/delete`)
    return res
  }

  const mutation = useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey,
      }),
  })

  return mutation
}

export default useDeleteEntryMutation
