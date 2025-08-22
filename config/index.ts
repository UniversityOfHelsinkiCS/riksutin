// INTERNAL
export const inStaging = process.env.REACT_APP_STAGING === 'true'
export const inProduction = !inStaging && process.env.NODE_ENV === 'production'

export const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID ?? ''
export const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET ?? ''
export const OIDC_REDIRECT_URI = process.env.OIDC_REDIRECT_URI ?? ''
export const OIDC_ISSUER = inProduction
  ? 'https://login.helsinki.fi/.well-known/openid-configuration'
  : 'https://login-test.it.helsinki.fi/.well-known/openid-configuration'

export const PRODUCTION_URL = 'https://risk-i.helsinki.fi'
export const STAGING_URL = 'https://riksutin.ext.ocp-test-0.k8s.it.helsinki.fi'
export const DEVELOPMENT_URL = 'http://localhost:3000'

export const API_TOKEN = process.env.API_TOKEN ?? ''
export const UNIT_API_TOKEN = process.env.UNIT_API_TOKEN ?? ''
export const EMPLOYEE_API_TOKEN = process.env.EMPLOYEE_API_TOKEN ?? ''
export const TUHAT_API_TOKEN = process.env.TUHAT_API_TOKEN ?? ''
export const HDR_API_TOKEN = process.env.HDR_API_TOKEN ?? ''

export const ORGANISATION_ID = process.env.ORGANISATION_ID ?? ''

console.log('ORGANISATION_ID', ORGANISATION_ID)

//Hy related
export const JAMI_URL = inProduction
  ? 'https://api-toska.apps.ocp-prod-0.k8s.it.helsinki.fi/jami/'
  : 'https://api-toska.apps.ocp-test-0.k8s.it.helsinki.fi/jami/'
export const PATE_URL = inProduction
  ? 'https://api-toska.apps.ocp-prod-0.k8s.it.helsinki.fi/pate/'
  : 'https://api-toska.apps.ocp-test-0.k8s.it.helsinki.fi/pate/'

export const EMPLOYEE_GW_API_URL = 'https://gw-api-test.it.helsinki.fi'
export const UNIT_GW_API_URL = 'https://gw.api.helsinki.fi'

const FULL_URL = inProduction ? PRODUCTION_URL : inStaging ? STAGING_URL : DEVELOPMENT_URL

export const TESTER_EMAILS = JSON.parse(process.env.TESTER_EMAILS ?? '[]') as string[]

// EXTERNAL
import type { InstanceExports } from '@config'
export default { FULL_URL } as Partial<InstanceExports>
