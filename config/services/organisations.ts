import axios from 'axios'

import type { UnitData, OrganisationData, TuhatData } from '@server/types'
import type { CanError, EmployeeResponse } from '@routes/types'

import {
  JAMI_URL,
  API_TOKEN,
  UNIT_GW_API_URL,
  UNIT_API_TOKEN,
  EMPLOYEE_GW_API_URL,
  EMPLOYEE_API_TOKEN,
  TUHAT_API_TOKEN,
} from '@userconfig'

export const jamiClient = axios.create({
  baseURL: JAMI_URL,
  params: {
    token: API_TOKEN,
  },
})

export const getTuhatData = async (userId: string): Promise<TuhatData[]> => {
  const url = UNIT_GW_API_URL + '/tuhatextapi/runningprojects'
  const response = await fetch(url, {
    headers: { 'x-api-key': TUHAT_API_TOKEN },
  })

  const data: {
    count: number
    pageInformation: object
    runningProjects: [
      {
        references: [
          {
            type: {
              fi_FI: string
              en_GB: string
              sv_SE: string
            }
          },
        ]
        endDate: string
        title: {
          fi_FI: string
          en_GB: string
          sv_SE: string
        }
        type: {
          fi_FI: string
          en_GB: string
          sv_SE: string
        }
        uuid: string
        faculty: string
        pureId: string
        managingOrganisationUnit: string
        startDate: string
        participants: [
          {
            role: {
              fi_FI: string
              en_GB: string
              sv_SE: string
              rolePureUri: string
            }
            username: string
            pureId: string
            firstName: string
            lastName: string
          },
        ]
      },
    ]
  } = await response.json()

  const filteredData = data.runningProjects
    .filter(({ participants }) => participants.map(({ username }) => username).includes(userId))
    .map(
      ({
        references,
        startDate,
        endDate,
        type,
        uuid,
        faculty,
        managingOrganisationUnit,
        pureId,
        title,
        participants,
      }) => ({
        tuhatId: uuid,
        pureId,
        startDate,
        endDate,
        faculty,
        managingOrganisationUnit,
        name: {
          fi: title.fi_FI || title.en_GB,
          en: title.en_GB || title.fi_FI,
          sv: title.sv_SE || title.en_GB || title.fi_FI,
        },
        type: {
          fi: type.fi_FI || type.en_GB,
          en: type.en_GB || type.fi_FI,
          sv: type.sv_SE || type.en_GB || type.fi_FI,
        },
        references,
        participants,
      })
    )

  return filteredData
}

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
