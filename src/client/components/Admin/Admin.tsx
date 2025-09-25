import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'

import { Box, Tab, Tabs } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useLoggedInUser from '../../hooks/useLoggedInUser'

const Admin = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, isLoading } = useLoggedInUser()

  if (isLoading) {
    return null
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" />
  }

  const pathParts = location.pathname.split('/').filter(Boolean)

  const tab = pathParts[1] === 'entry' ? 'summary' : pathParts[1]

  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        width: '100%',
        bgcolor: 'background.paper',
        m: 3,
      }}
    >
      <Tabs value={tab} variant="scrollable" scrollButtons allowScrollButtonsMobile>
        <Tab component={Link} to="./summary" label={t('admin:summaryTab')} value="summary" />
        <Tab component={Link} to="./edit-survey" label={t('admin:surveyTab')} value="edit-survey" />
        <Tab component={Link} to="./edit-questions" label={t('admin:questionTab')} value="edit-questions" />
        <Tab component={Link} to="./edit-results" label={t('admin:resultTab')} value="edit-results" />
        <Tab component={Link} to="./warnings" label={t('admin:warningTab')} value="warnings" />
      </Tabs>
      <Outlet />
    </Box>
  )
}
export default Admin
