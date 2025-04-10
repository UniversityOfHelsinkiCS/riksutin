import axios from 'axios'

import type { UnitData, OrganisationData } from '@server/types'
import type { CanError, EmployeeResponse } from '@routes/types'

import {
  JAMI_URL,
  API_TOKEN,
  UNIT_GW_API_URL,
  UNIT_API_TOKEN,
  EMPLOYEE_GW_API_URL,
  EMPLOYEE_API_TOKEN,
} from '@userconfig'

export const jamiClient = axios.create({
  baseURL: JAMI_URL,
  params: {
    token: API_TOKEN,
  },
})

export const getUnitData = async (): Promise<UnitData[]> => {
  const url = UNIT_GW_API_URL + '/organisation/info/v1/financeUnitsPublic'

  const response = await fetch(url, {
    headers: { 'x-api-key': UNIT_API_TOKEN },
  })

  const data: {
    uniqueId: string
    type: string
    code: string
    nameFi: string
    nameEn: string
    nameSv: string
    parent: string
  }[] = await response.json()

  const filteredData = data
    .filter(({ code }) => !!code)
    .map(({ code, nameFi, nameEn, nameSv }) => ({
      code,
      name: {
        fi: nameFi,
        en: nameEn,
        sv: nameSv,
      },
    }))

  return filteredData
}

export const getOrganisationData = async (): Promise<OrganisationData[]> => {
  const { data } = await jamiClient.get('/organisation-data')

  return data
}

export const getUserOrganisations = async (userId: string, iamGroups: string[]): Promise<OrganisationData[]> => {
  const { data } = await jamiClient.post('/user-organisations', {
    userId,
    iamGroups,
  })

  return data || []
}

export const getEmployeeData = async (search: string): Promise<CanError<EmployeeResponse[]>> => {
  const url = EMPLOYEE_GW_API_URL + '/employeeinformation/v1?search=' + encodeURIComponent(search)

  const response = await fetch(url, {
    headers: { 'x-api-key': EMPLOYEE_API_TOKEN },
  })

  const SUCCESS = 200
  if (response.status !== SUCCESS) {
    const { message: error } = await response.json()

    return { error }
  }

  return response.json()
}
