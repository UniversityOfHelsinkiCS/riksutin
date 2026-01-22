/* eslint-disable no-console */
import axios from 'axios'

import { PUBLIC_URL } from '@config'

const baseURL = `${PUBLIC_URL}/api`

const apiClient = axios.create({ baseURL })

// Intercept 401 and 500 responses and let them bubble up to error boundary
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request:', error.config?.url)
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.config?.url)
    }
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error)
  }
)

export default apiClient
