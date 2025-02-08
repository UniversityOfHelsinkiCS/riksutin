import { useState } from 'react'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import styles from '../../styles'
import { useUserEntries } from '../../hooks/useEntry'
import { useUpdateEntryRisks } from '../../hooks/useSaveEntryMutation'

const { riskColors, resultStyles } = styles

const UserPage = () => {
  const { entries } = useUserEntries()
  const { t } = useTranslation()
  const mutation = useUpdateEntryRisks()
  const [updateButtonClicked, setUpdateButtonClicked] = useState('')

  const entriesWithData = entries?.filter(
    (entry) => entry.data.answers && entry.data.country && entry.data.risks
  )

  const handleUpdateRiskAssessment = async (entryId: string) => {
    setUpdateButtonClicked(entryId)
    await mutation.mutateAsync(entryId)
    enqueueSnackbar(t('userPage:updateSuccess'), {
      variant: 'success',
    })
  }

  if (!entriesWithData)
    return (
      <Box sx={{ m: 3 }}>
        <Typography variant="h6" sx={{ my: 4, pl: 1 }}>
          {t('userPage:noPreviousEntries')}
        </Typography>
      </Box>
    )

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
        <Table sx={{ maxWidth: '45rem' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('userPage:projectName')}</TableCell>
              <TableCell>{t('userPage:tableDate')}</TableCell>
              <TableCell align="center">
                {t('userPage:tableTotalRiskLevel')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entriesWithData.map((entry) => (
              <TableRow key={entry.id} data-testid="entrybox">
                <TableCell component="th" scope="row">
                  <Link to={`/user/${entry.id.toString()}`}>
                    {entry.data.answers['3']}
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(entry.createdAt).toLocaleDateString()}{' '}
                  {new Date(entry.createdAt).toLocaleTimeString()}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={[
                      {
                        backgroundColor:
                          riskColors[
                            entry.data.risks.find((r) => r.id === 'total')
                              ?.level > 3
                              ? 3
                              : entry.data.risks.find((r) => r.id === 'total')
                                  ?.level
                          ],
                      },
                      resultStyles.tableCell,
                    ]}
                  >
                    {entry.data.risks.find((r) => r.id === 'total')?.level}
                  </Box>
                </TableCell>
                <TableCell colSpan={2}>
                  <Button
                    onClick={() =>
                      handleUpdateRiskAssessment(entry.id.toString())
                    }
                    disabled={updateButtonClicked === entry.id.toString()}
                  >
                    {t('userPage:updateRiskAssessment')}
                  </Button>
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
