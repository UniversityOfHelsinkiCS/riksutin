import { useState } from 'react'
import { Alert, Box, Button, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const navigate = useNavigate()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (!entryId || !entry || !survey) {
    return null
  }

  const { answers, country, updatedData } = entry.data
  const sortedUpdatedData = updatedData ? [...updatedData].reverse() : []

  const getChangedFields = (currentAnswers: any, previousAnswers: any): Set<number> => {
    const changed = new Set<number>()
    if (!previousAnswers) {
      return changed
    }

    Object.keys(currentAnswers).forEach(key => {
      const numKey = Number(key)
      if (!isNaN(numKey)) {
        const current = JSON.stringify(currentAnswers[key])
        const previous = JSON.stringify(previousAnswers[key])
        if (current !== previous) {
          changed.add(numKey)
        }
      }
    })
    return changed
  }

  return (
    <MuiComponentProvider>
      <div>
        {entry.testVersion && (
          <Alert severity="warning" sx={{ m: 3, fontWeight: 'bold', fontSize: '1.1rem' }}>
            {t('userPage:testVersionWarning')}
          </Alert>
        )}
        <Box sx={{ m: 3 }}>
          <Box sx={{ width: '100%', my: 2, display: 'flex', gap: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button variant="outlined">
                <ArrowBackIcon sx={{ mr: 1 }} />
                {t('userPage:backButton')}
              </Button>
            </Link>
            {tabValue === 0 && (
              <Button variant="outlined" onClick={() => navigate(`/user/${entryId}/edit`)} data-testid="edit-button">
                {t('userPage:editEntry')}
              </Button>
            )}
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange} data-testid="version-tabs">
              <Tab
                sx={{ color: 'black' }}
                label={formatDate(entry.updatedAt ?? entry.createdAt)}
                data-testid="current-version-tab"
              />
              {sortedUpdatedData?.map((updated, index) => (
                <Tab
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={index}
                  sx={{ color: 'black' }}
                  label={formatDate(updated.createdAt!)}
                  data-testid={`version-tab-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <RiskTableDOM riskData={entry.data} countryData={country[0]} />
            <RenderAnswersDOM
              survey={survey}
              resultData={answers}
              changedFields={getChangedFields(answers, sortedUpdatedData?.[0]?.answers)}
            />
          </TabPanel>
          {sortedUpdatedData?.map((updated, index) => {
            const previousAnswers = sortedUpdatedData[index + 1]?.answers
            return (
              /* eslint-disable-next-line react/no-array-index-key */
              <TabPanel key={index} value={tabValue} index={index + 1}>
                <RiskTableDOM riskData={updated} countryData={country[0]} />
                <RenderAnswersDOM
                  survey={survey}
                  resultData={updated.answers ?? answers}
                  changedFields={getChangedFields(updated.answers ?? answers, previousAnswers)}
                />
              </TabPanel>
            )
          })}
        </Box>
        <SendSummaryEmail entryId={entryId} />
      </div>
    </MuiComponentProvider>
  )
}

export default UserEntry
