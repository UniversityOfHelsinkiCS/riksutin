import {
  getOrganisationData as implGetOrganisationData,
  getUserOrganisations as implGetUserOrganisationData,
} from '@userservices/jami'

const defaultGetOrganisationData = () => {
  return []
}

const defaultGetUserOrganisations = () => {
  return []
}

export const getOrganisationData = implGetOrganisationData ?? defaultGetOrganisationData
export const getUserOrganisations = implGetUserOrganisationData ?? defaultGetUserOrganisations
