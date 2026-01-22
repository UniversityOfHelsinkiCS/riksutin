import { QueryClient } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // Throw errors to error boundary for 401 and 500 errors
      useErrorBoundary: (error: any) => {
        return error?.response?.status === 401 || error?.response?.status === 500
      },
    },
  },
})

export default queryClient
