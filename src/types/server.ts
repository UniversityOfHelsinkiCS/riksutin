import type { BaseCountry, CountryData, Locales, RiskData, User } from '@types'

import { Request } from 'express'
import { Entry } from '@dbmodels'

type Region = {
  id: string
  iso2Code: string
  value: string
}

export interface FullCountry extends BaseCountry {
  id: string
  region: Region
  adminregion: Region
  incomeLevel: Region
  lendingType: Region
  capitalCity: string
  longitude: string
  latitude: string
}

type Programme = {
  key: string
  name: Locales
  level: string
  companionFaculties: string[]
  international: boolean
}

export interface UnitData {
  code: string
  name: Locales
}

type Participant = {
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
}

type Reference = {
  type: {
    fi_FI: string
    en_GB: string
    sv_SE: string
  }
}

export interface TuhatData {
  tuhatId: string
  references: Reference[]
  endDate: string
  name: {
    fi: string
    en: string
    sv: string
  }
  type: {
    fi: string
    en: string
    sv: string
  }
  faculty: string
  pureId: string
  managingOrganisationUnit: string
  startDate: string
  participants: Participant[]
}

export interface OrganisationData extends UnitData {
  programmes: Programme[]
}

export interface UserInfo {
  uid: string
  hyPersonSisuId: string
  email: string
  hyGroupCn: string[]
  preferredLanguage: string
  given_name: string
  family_name: string
}

export interface RequestWithUser extends Request {
  user: User
}

export interface EntryValues {
  data: RiskData
  tuhatData: TuhatData
  sessionToken: string
}

export interface EntryWithUser extends Entry {
  User: User
}

export type UpdatedCountryData = CountryData

export type Info = {
  page: number
  pages: number
  per_page: number
  total: number
  sourceid?: string
  lastupdated?: string
}

type Value = {
  id: string
  value: string
}

export type Indicator = {
  indicator: Value
  country: Value
  countryiso3code: string
  date: string
  value?: number
  unit: string
  obs_status: string
  decimal: number
}
