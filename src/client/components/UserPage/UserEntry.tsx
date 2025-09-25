import { useState } from 'react'
import { Box, Button, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RiskTableDOM from '../ResultPage/RiskTableDOM'
import { useEntry } from '../../hooks/useEntry'
import useSurvey from '../../hooks/useSurvey'
import MuiComponentProvider from '../Common/MuiComponentProvider'
import RenderAnswersDOM from '../ResultPage/RenderAnswersDOM'
import SendSummaryEmail from '../ResultPage/SendSummaryEmail'

interface TabPanelProps {
  children: React.ReactNode
  index: number
  value: number
}

const formatDate = (dateString: string) =>
  `${new Date(dateString).toLocaleDateString()} ${new Date(dateString).toLocaleTimeString()}`

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            alignSelf: 'flex-start',
            width: '100%',
            bgcolor: 'background.paper',
            m: 5,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

const UserEntry = () => {
  const { entryId } = useParams()
  const { survey } = useSurvey()
  const { entry } = useEntry(entryId)
  const [tabValue, setTabValue] = useState(0)
  const { t } = useTranslation()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (!entryId || !entry || !survey) {
    return null
  }

  const { answers, country, updatedData } = entry.data

  return (
    <MuiComponentProvider>
      <div>
        <Box sx={{ m: 3 }}>
          <Box sx={{ width: '100%', my: 2 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button variant="outlined">
                <ArrowBackIcon sx={{ mr: 1 }} />
                {t('userPage:backButton')}
              </Button>
            </Link>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab sx={{ color: 'black' }} label={formatDate(entry.createdAt)} />
              {updatedData?.map((updated, index) => (
                <Tab
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={index}
                  sx={{ color: 'black' }}
                  label={formatDate(updated.createdAt!)}
                />
              ))}
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <RiskTableDOM riskData={entry.data} countryData={country[0]} />
          </TabPanel>
          {updatedData?.map((updated, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <TabPanel key={index} value={tabValue} index={index + 1}>
              <RiskTableDOM riskData={updated} countryData={country[0]} />
            </TabPanel>
          ))}
          <RenderAnswersDOM survey={survey} resultData={answers} />
        </Box>
        <SendSummaryEmail entryId={entryId} />
      </div>
    </MuiComponentProvider>
  )
}

export default UserEntry
