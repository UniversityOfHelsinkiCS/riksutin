import {
  getUnitData as implGetUnitData,
  getOrganisationData as implGetOrganisationData,
  getUserOrganisations as implGetUserOrganisationData,
  getEmployeeData as implGetEmployeeData,
} from '@userservices/organisations'

const defaultGetUnitData = () => {
  return []
}

const defaultGetOrganisationData = () => {
  return []
}

const defaultGetEmployeeData = (_: string) => {
  return []
}

const defaultGetUserOrganisations = () => {
  return []
}

export const getUnitData = implGetUnitData ?? defaultGetUnitData
export const getOrganisationData = implGetOrganisationData ?? defaultGetOrganisationData
export const getOrganisationEmployeeData = implGetEmployeeData ?? defaultGetEmployeeData
export const getUserOrganisations = implGetUserOrganisationData ?? defaultGetUserOrganisations
