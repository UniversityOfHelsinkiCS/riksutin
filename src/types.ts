export type BaseCountry = {
  iso2Code: string
  name: string
}

export type Warning = {
  id: number
  country: string
  text: Locales
  expiry_date?: string
  createdAt: string
  updatedAt: string
}

export type NewWarning = {
  country: string
  text: Locales
  expiry_date?: string
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

export type ChoiceType = SingleChoiceType[] | MultipleChoiceType[]

export type SingleChoiceType = {
  id: string
  label: string
  title: Locales
  risk?: number
}

export type PossibleChoiceTypes =
  | 'singleChoice'
  | 'multipleChoice'
  | 'info'
  | 'text'
  | 'employeeSelect'
  | 'countrySelect'
  | 'organisationSelect'
  | 'universitySelect'
  | 'highRiskCountrySelect'
  | 'noneditable'

type Attributes = {
  multiline: boolean
  minRows: number
  inputProps: { maxLength: number }
}

export interface OptionData {
  type: PossibleChoiceTypes
  options: ChoiceType
  label?: Locales
  attributes?: Attributes
}

export interface OptionUpdates {
  title: Locales
  data?: Locales
}

export type MultipleChoiceType = SingleChoiceType & {
  data: Locales
}

export interface InfoType {
  id: string
  title: Locales
}

export type Locales = {
  fi?: string
  en?: string
  sv?: string
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
    createdAt?: string
  }[]
}

export interface Question {
  id: number
  surveyId: number
  parentId: number | null
  priority: number
  title: Locales
  shortTitle?: Locales
  text: Locales
  optionData: OptionData
  visibility: Visibility
}

/** List of question selection id's that controls the visibility of a tool */
export type Visibility = {
  options?: string[]
}
