import { useState } from 'react'
import { Box, Button, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RiskTableDOM from '../ResultPage/RiskTableDOM'
import { useEntry } from '../../hooks/useEntry'
import useSurvey from '../../hooks/useSurvey'
import MuiComponentProvider from '../Common/MuiComponentProvider'
import RenderAnswersDOM from '../ResultPage/RenderAnswersDOM'
import { usePrintMutation } from 'src/client/hooks/usePrintMutation'

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
  const location = useLocation()
  const { survey } = useSurvey()
  const { entry } = useEntry(entryId)
  const printMutation = usePrintMutation(entryId)
  const [tabValue, setTabValue] = useState(0)
  const { t } = useTranslation()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handlePrintClick = async () => {
    try {
      const pdfData = await printMutation.mutateAsync()

      // Create a Blob from the PDF data
      const blob = new Blob([pdfData], { type: 'application/pdf' })

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${entryId}.pdf`

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      window.URL.revokeObjectURL(url)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error downloading PDF:', error)
    }
  }

  if (!entry || !survey) return null

  const { answers, country, updatedData } = entry.data

  const parentPage = location.pathname.split('/')[1] === 'admin' ? '/admin/summary' : '/user'

  return (
    <MuiComponentProvider>
      <div>
        <Box sx={{ m: 3 }}>
          <Box sx={{ width: '100%', my: 2 }}>
            <Link to={parentPage} style={{ textDecoration: 'none', color: 'inherit' }}>
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
        <Button variant="outlined" onClick={handlePrintClick}>
          {t('userPage:printButton')}
        </Button>
      </div>
    </MuiComponentProvider>
  )
}

export default UserEntry
