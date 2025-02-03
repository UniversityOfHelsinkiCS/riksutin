import type { CountryData } from '@types'

import { useQuery } from 'react-query'

import apiClient from '../util/apiClient'

const useCountry = (code: string | undefined) => {
  const queryKey = ['country', code]

  const query = async (): Promise<CountryData> => {
    const { data } = await apiClient.get(`/countries/${code}`)

    return data
  }

  const { data: country, ...rest } = useQuery(queryKey, query, {
    enabled: Boolean(code),
  })

  return { country, ...rest }
}

export default useCountry
