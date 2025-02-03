import { Control, UseFormWatch, UseFormRegister } from 'react-hook-form'

import type { FormValues, Locales, Question, RiskData, User } from '@types'

import { FORM_DATA_KEY } from '@config'

export interface InputProps {
  control?: Control<any>
  watch?: UseFormWatch<any>
  register?: UseFormRegister<any>
  question?: Question
  children?: React.ReactNode
  language?: string
  questions?: Question[]
  isSubmitted?: boolean
  selectedCountry?: string
  defaultValue?: string
}

type SurveySave = typeof FORM_DATA_KEY

export interface PersistForm {
  value: FormValues
  sessionStorageKey: SurveySave
}

export interface Dimension {
  id: string
  label: string
  color: string
  title: Locales
  text: Locales
}

export interface Survey {
  id: number
  name: string
  title: Locales
  text: Locales
  Questions: Question[]
  createdAt?: Date
  updatedAt?: Date
}

export type Entry = {
  id: number
  surveyId: number
  userId: string
  data: RiskData
  sessionToken: string
  reminderSent: boolean
  SurveyId: number
  UserId: string
  createdAt: string
  survey: Survey
  User: User
}
