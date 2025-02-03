export type BaseCountry = {
  iso2Code: string
  name: string
}

export type CountryData = {
  academicfreedom: number
  code: string
  corruption: number
  stability: number
  hci: number
  safetyLevel: number
  universities: string[]
  sanctions: number
  gdpr: number | null
  createdAt?: string
  ruleOfLaw: number
}

export interface Faculty {
  code: string
  name: Locales
}

export type ChoiceType = SingleChoiceType[] | MultipleChoiceType[] | any[]

export type SingleChoiceType = {
  id: string
  label: string
  title: Locales
  risk: number
}

export type PossibleChoiceTypes =
  | 'singleChoice'
  | 'multipleChoice'
  | 'info'
  | 'text'
  | 'countrySelect'
  | 'organisationSelect'
  | 'universitySelect'
  | 'highRiskCountrySelect'

export interface OptionData {
  type: PossibleChoiceTypes
  options: ChoiceType
  label?: Locales
}

export interface OptionUpdates {
  title: Locales
  data?: Locales
}

export interface MultipleChoiceType extends SingleChoiceType {
  data: Locales
}

export interface InfoType {
  id: string
  title: Locales
}

export type Locales = {
  fi: string
  en: string
  sv: string
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  language: string
  isAdmin: boolean
  iamGroups: string[]
  newUser?: boolean
}

export interface Result {
  id: number
  surveyId: number
  optionLabel: string
  isSelected: Locales
  data: Record<string, Locales>
}

export interface Risk {
  id: string
  title: string
  level: number
  infoText?: string
}

export interface FormValues {
  [key: string]: any
  faculty: string
  selectOrganisation: string
}

export interface RiskData {
  answers: FormValues
  risks: Risk[]
  country: CountryData[]
  updatedData?: {
    answers: FormValues
    risks: Risk[]
    country: CountryData[]
    createdAt: string
  }[]
}

export interface Question {
  id: number
  surveyId: number
  parentId: number | null
  priority: number
  title: Locales
  text: Locales
  optionData: OptionData
  visibility: Visibility
}

/** List of question selection id's that controls the visibility of a tool */
export type Visibility = {
  options?: string[]
}
