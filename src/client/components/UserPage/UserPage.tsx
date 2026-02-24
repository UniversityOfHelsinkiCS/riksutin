import { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import styles from '../../styles'
import { useUserEntries } from '../../hooks/useEntry'
import { useUpdateEntryRisks } from '../../hooks/useSaveEntryMutation'
import useDeleteEntryMutation from '../../hooks/useDeleteEntryMutation'
import { CONTROL_REPORT_CHECK_ENABLED } from '@config'

const { riskColors, resultStyles } = styles

const UserPage = () => {
  const { entries } = useUserEntries()
  const { t } = useTranslation()
  const mutation = useUpdateEntryRisks()
  const deleteMutation = useDeleteEntryMutation()
  const [updateButtonClicked, setUpdateButtonClicked] = useState('')

  if (!entries) {
    return (
      <Box sx={{ m: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  // eslint-disable-next-line no-console
  console.log('CONTROL_REPORT_CHECK_ENABLED', CONTROL_REPORT_CHECK_ENABLED)

  const entriesWithData = entries?.filter(entry => entry.data.answers && entry.data.country && entry.data.risks)

  const handleUpdateRiskAssessment = async (entryId: string) => {
    setUpdateButtonClicked(entryId)
    await mutation.mutateAsync(entryId)
    enqueueSnackbar(t('userPage:updateSuccess'), {
      variant: 'success',
    })
  }

  const handleDeleteEntry = (entryId: string, projectName: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(t('userPage:deleteConfirmation', { projectName }))) {
      return
    }

    try {
      deleteMutation.mutate(entryId)
      enqueueSnackbar(t('userPage:deleteSuccess'), { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  if (entries.length === 0) {
    return (
      <Box sx={{ m: 3 }}>
        <Typography variant="h6" sx={{ my: 4, pl: 1 }}>
          {t('userPage:noPreviousEntries')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        width: '100%',
        bgcolor: 'background.paper',
        mx: 2,
        mt: 2,
      }}
    >
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" sx={{ my: 4, pl: 1 }}>
          {t('userPage:previousEntries')}
        </Typography>
      </Box>
      <TableContainer sx={{ m: 2 }}>
        <Table sx={{ maxWidth: '60rem' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('userPage:projectName')}</TableCell>
              <TableCell>{t('userPage:tableDate')}</TableCell>
              <TableCell align="center">{t('userPage:tableTotalRiskLevel')}</TableCell>
              <TableCell align="center">{t('userPage:actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entriesWithData.map(entry => (
              <TableRow
                key={entry.id}
                data-testid="entrybox"
                sx={{
                  backgroundColor: entry.testVersion ? '#fffef5' : 'inherit',
                }}
              >
                <TableCell component="th" scope="row">
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link to={`/user/${entry.id.toString()}`}>{entry.data.answers['3']}</Link>
                      {CONTROL_REPORT_CHECK_ENABLED &&
                        entry.data.risks.find(r => r.id === 'total')?.level === 3 &&
                        (!entry.controlReports || entry.controlReports.length === 0) && (
                          <Tooltip title={t('controlReport:noReportsWarning')}>
                            <WarningIcon sx={{ color: '#e74c3c', fontSize: '1.2rem' }} />
                          </Tooltip>
                        )}
                    </Box>
                    {entry.testVersion && (
                      <Box
                        component="div"
                        sx={{ color: 'red', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}
                      >
                        TEST VERSION
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString()}
                </TableCell>
                <TableCell sx={{ paddingLeft: 7 }}>
                  <Box
                    sx={[
                      {
                        backgroundColor:
                          riskColors[Math.min(3, entry.data.risks.find(r => r.id === 'total')?.level ?? 9000)],
                      },
                      resultStyles.tableCell,
                    ]}
                  >
                    {entry.data.risks.find(r => r.id === 'total')?.level}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      onClick={() => handleUpdateRiskAssessment(entry.id.toString())}
                      disabled={updateButtonClicked === entry.id.toString()}
                    >
                      {t('userPage:updateRiskAssessment')}
                    </Button>
                    {entry.testVersion && (
                      <IconButton
                        onClick={() => handleDeleteEntry(entry.id.toString(), entry.data.answers['3'])}
                        color="error"
                        title={t('userPage:deleteEntry')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default UserPage
