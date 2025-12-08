import type { BaseCountry, Locales, CountryData, RiskData, User, countryRiskData } from '@types'

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

export type TuhatData = {
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
  testVersion: boolean
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

// For MyResearch api
type BaseObject = {
  title: string
  level: number
  infoText: string
}

interface CountryObject extends BaseObject {
  riskValues?: number[] | []
  totalCountryRiskLevel?: number
  rawTotalCountryRiskLevel?: number
}

export type CountriesData = {
  code: string
  name: string
  countryRisk?: countryRiskData
  academicFreedom?: CountryObject
  corruption: CountryObject
  stability: CountryObject
  humanDevelopment: CountryObject
  safetyLevel: CountryObject
  sanctions: CountryObject
  gdpr: CountryObject
  ruleOfLaw: CountryObject
}

interface RiskAnalysisObject extends BaseObject {
  economicExchange?: BaseObject
  economicScope?: BaseObject
  countriesData?: CountriesData[] | []
  multilateralCountriesData?: CountriesData[] | []
}

export type RiskAnalysisData = {
  totalRisk: RiskAnalysisObject
  countryTotal: RiskAnalysisObject
  university: RiskAnalysisObject
  organisation: RiskAnalysisObject
  duration: RiskAnalysisObject
  economic: RiskAnalysisObject
  dualUse: RiskAnalysisObject
  ethical: RiskAnalysisObject
  consortium: RiskAnalysisObject
}

export interface MyResearchData {
  tuhatId: string
  riskAnalysis: RiskAnalysisData
  createdAt: Date
  updatedAt: Date
}

export type Error = {
  error: string
}
