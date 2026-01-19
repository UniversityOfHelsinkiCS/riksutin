import { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import styles from '../../styles'
import { useUserEntries } from '../../hooks/useEntry'
import { useUpdateEntryRisks } from '../../hooks/useSaveEntryMutation'

const { riskColors, resultStyles } = styles

const UserPage = () => {
  const { entries } = useUserEntries()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const mutation = useUpdateEntryRisks()
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

  const entriesWithData = entries?.filter(entry => entry.data.answers && entry.data.country && entry.data.risks)

  const handleUpdateRiskAssessment = async (entryId: string) => {
    setUpdateButtonClicked(entryId)
    await mutation.mutateAsync(entryId)
    enqueueSnackbar(t('userPage:updateSuccess'), {
      variant: 'success',
    })
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
              <TableRow key={entry.id} data-testid="entrybox">
                <TableCell component="th" scope="row">
                  <Link
                    to={`/user/${entry.id.toString()}`}
                  >{`${entry.data.answers['3']} ${entry.testVersion ? '-TEST VERSION-' : ''}`}</Link>
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
                      onClick={() => navigate(`/user/${entry.id}/edit`)}
                      variant="outlined"
                      data-testid="edit-entry-button"
                    >
                      {t('userPage:editEntry')}
                    </Button>
                    <Button
                      onClick={() => handleUpdateRiskAssessment(entry.id.toString())}
                      disabled={updateButtonClicked === entry.id.toString()}
                    >
                      {t('userPage:updateRiskAssessment')}
                    </Button>
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
