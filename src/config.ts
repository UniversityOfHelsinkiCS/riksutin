import implementationSpecific from '@userconfig'

// App state
export const inE2EMode = process.env.REACT_APP_E2E === 'true'

export const inDevelopment = process.env.NODE_ENV === 'development'
export const inStaging = process.env.REACT_APP_STAGING === 'true'
export const inAcualStaging = process.env.ACUAL_STAGING === 'true'
export const inProduction = !inStaging && process.env.NODE_ENV === 'production'

// Config
export interface InstanceExports {
  appName: string
  contactEmail: string
  supportEmail: string

  DEFAULT_SURVEY_NAME: string
  PUBLIC_URL: string
  FULL_URL: string

  TUHAT_DATA_STORAGE_KEY: string
  FORM_DATA_KEY: string
  SESSION_TOKEN: string
  LOCATION_KEY: string
}

const DEFAULT_URL = 'http://localhost:3000'
const defaults: InstanceExports = {
  appName: 'Riskiarviointi',
  contactEmail: '',
  supportEmail: 'grp-int-risks@helsinki.fi',

  DEFAULT_SURVEY_NAME: process.env.DEFAULT_SURVEY_NAME ?? 'testSurvey',
  PUBLIC_URL: process.env.PUBLIC_URL ?? '',
  FULL_URL: DEFAULT_URL,

  FORM_DATA_KEY: 'riksutin_local_save',
  TUHAT_DATA_STORAGE_KEY: 'tuhat_local_save',
  SESSION_TOKEN: 'riksutin_session_token',
  LOCATION_KEY: 'riksutin_session_location',
}

// Extend config with preferences
export const {
  appName,
  contactEmail,
  supportEmail,

  DEFAULT_SURVEY_NAME,
  PUBLIC_URL,
  FULL_URL,

  FORM_DATA_KEY,
  TUHAT_DATA_STORAGE_KEY,
  SESSION_TOKEN,
  LOCATION_KEY,
} = Object.assign(defaults, implementationSpecific)

//
export const SENTRY_DNS = 'https://64dd6a17eea106fe721e79664269a1b1@toska.it.helsinki.fi/12'
export const SENTRY_DNS_FRONTEND = 'https://ef339d600209fafb712e65773c1b4644@toska.it.helsinki.fi/17'
export const SENTRY_GIT_SHA = process.env.REACT_APP_GIT_SHA

// Feature toggles
export const CONTROL_REPORT_CHECK_ENABLED = process.env.REACT_APP_CONTROL_REPORT_CHECK_ENABLED === 'true'
