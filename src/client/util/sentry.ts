import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { inProduction, inStaging, inE2EMode, SENTRY_DNS, SENTRY_GIT_SHA } from '@config'

const initializeSentry = () => {
  if (!inProduction || inStaging || inE2EMode) {
    return
  }

  Sentry.init({
    dsn: SENTRY_DNS,
    release: SENTRY_GIT_SHA,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
  })
}

export default initializeSentry
