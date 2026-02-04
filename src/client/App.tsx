import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'

import { FULL_URL } from '@config'
import { useTheme } from './theme'
import useLoggedInUser from './hooks/useLoggedInUser'
import { ResultDataProvider } from './contexts/ResultDataContext'
import Footer from './components/Footer'
import NavBar from './components/NavBar/NavBar'
import Unauthorized from './components/Errors/Unauthorized'

const App = () => {
  const theme = useTheme()

  const { user, isLoading } = useLoggedInUser()
  if (isLoading) {
    return null
  }
  if (!user?.id) {
    window.location.href = `${FULL_URL}/api/login`
    return null
  }

  const hasAccess = user?.iamGroups?.some((group: string) => ['hy-employees', 'grp-hyplus-kaikki'].includes(group))

  if (!hasAccess) {
    return (
      <ThemeProvider theme={theme}>
        <Unauthorized />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider preventDuplicate>
        <ResultDataProvider>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NavBar />
            <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <Outlet />
            </Box>
            <Footer />
          </Box>
        </ResultDataProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
