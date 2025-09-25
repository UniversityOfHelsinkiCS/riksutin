import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import * as Sentry from '@sentry/browser'

import Error from './Error'
import NotFound from './NotFound'
import Unauthorized from './Unauthorized'

const RootBoundary = () => {
  const error = useRouteError() as any

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      Sentry.captureException(error.error)
    } else {
      Sentry.captureException(error)
    }
  }, [error])

  if (error?.response?.data) {
    if (error.response.status === 404) {
      return <NotFound />
    }

    if (error.response.status === 401) {
      return <Unauthorized />
    }
  }
  return <Error />
}

export default RootBoundary
