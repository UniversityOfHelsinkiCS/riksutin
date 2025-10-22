import * as Sentry from '@sentry/browser'
import { inProduction, inStaging, inE2EMode, SENTRY_DNS, SENTRY_GIT_SHA } from '@config'

const initializeSentry = () => {
  if (!inProduction || inStaging || inE2EMode) {
    return
  }

  Sentry.init({
    dsn: SENTRY_DNS,
    release: SENTRY_GIT_SHA,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  })
}

export default initializeSentry
