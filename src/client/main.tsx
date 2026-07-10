import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import CssBaseline from '@mui/material/CssBaseline'

import Router from './Router'

import queryClient from './util/queryClient'
import initializeSentry from './util/sentry'
import initializeI18n from './util/il18n'

initializeSentry()
// HACK:
initializeI18n().catch(_ => {})

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline>
        <Router />
      </CssBaseline>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  </StrictMode>
)
