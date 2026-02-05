import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'
import MDEditor from '@uiw/react-md-editor'

import { ControlReport } from '@types'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import Markdown from '../Common/Markdown'
import apiClient from '../../util/apiClient'
import styles from '../../styles'

interface ControlReportsProps {
  entryId: string
  controlReports: ControlReport[]
  totalRiskLevel: number | null | undefined
  onUpdate: () => void
}

const ControlReports = ({ entryId, controlReports, totalRiskLevel, onUpdate }: ControlReportsProps) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<ControlReport | null>(null)
  const [text, setText] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { cardStyles } = styles

  const isAdmin = user?.isAdmin
  const canAddReport = isAdmin && totalRiskLevel === 3

  const handleOpenDialog = (report?: ControlReport) => {
    if (report) {
      setEditingReport(report)
      setText(report.text)
    } else {
      setEditingReport(null)
      setText('')
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingReport(null)
    setText('')
  }

  const handleSave = async () => {
    if (!text.trim()) {
      enqueueSnackbar(t('controlReport:createError'), { variant: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        text,
      }

      if (editingReport) {
        await apiClient.put(`/entries/${entryId}/control-report/${editingReport.id}`, payload)
        enqueueSnackbar(t('controlReport:updateSuccess'), { variant: 'success' })
      } else {
        await apiClient.post(`/entries/${entryId}/control-report`, payload)
        enqueueSnackbar(t('controlReport:createSuccess'), { variant: 'success' })
      }

      handleCloseDialog()
      onUpdate()
    } catch (error: any) {
      const message = editingReport ? t('controlReport:updateError') : t('controlReport:createError')
      enqueueSnackbar(error?.response?.data || message, { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (reportId: string) => {
    setReportToDelete(reportId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) {
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.delete(`/entries/${entryId}/control-report/${reportToDelete}`)
      enqueueSnackbar(t('controlReport:deleteSuccess'), { variant: 'success' })
      setDeleteDialogOpen(false)
      setReportToDelete(null)
      onUpdate()
    } catch (error) {
      enqueueSnackbar(t('controlReport:deleteError'), { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) =>
    `${new Date(dateString).toLocaleDateString()} ${new Date(dateString).toLocaleTimeString()}`

  return (
    <Box sx={cardStyles.nestedSubSection}>
      {canAddReport && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            {t('controlReport:addButton')}
          </Button>
        </Box>
      )}

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        {t('controlReport:title')}
      </Typography>

      {isAdmin && totalRiskLevel !== 3 && controlReports.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('controlReport:riskLevel3Required')}
        </Alert>
      )}

      {controlReports.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('controlReport:noReports')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {controlReports.map(report => (
            <Card key={report.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('controlReport:createdBy')}: {report.createdBy}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      {t('controlReport:lastUpdated')}: {formatDate(report.updatedAt)}
                    </Typography>
                  </Box>
                  {isAdmin && (
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenDialog(report)} sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(report.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Markdown>{report.text}</Markdown>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingReport ? t('controlReport:editButton') : t('controlReport:addButton')}</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {t('controlReport:markdownSupported')}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <MDEditor value={text} onChange={value => setText(value ?? '')} height={300} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            {t('controlReport:cancelButton')}
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={isSubmitting}>
            {t('controlReport:saveButton')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('controlReport:deleteButton')}</DialogTitle>
        <DialogContent>
          <Typography>{t('controlReport:confirmDelete')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isSubmitting}>
            {t('controlReport:cancelButton')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isSubmitting}>
            {t('controlReport:deleteButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ControlReports
