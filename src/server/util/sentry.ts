import { init as initSentry, httpIntegration, expressIntegration } from '@sentry/node'

import { inProduction, inStaging, inE2EMode, SENTRY_DNS, SENTRY_GIT_SHA } from '@config'

const initializeSentry = () => {
  if (!inProduction || inStaging || inE2EMode) {
    return
  }

  initSentry({
    dsn: SENTRY_DNS,
    release: SENTRY_GIT_SHA,
    integrations: [httpIntegration({ breadcrumbs: true }), expressIntegration()],
    tracesSampleRate: 1.0,
  })
}

export default initializeSentry
