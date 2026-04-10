import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'

import { ControlReport, EntryStateChange } from '@types'
import { ENTRY_STATES, EntryState, getEntryStateColor, getEntryStateLabel, getEntryStateSx } from '@common/entryStates'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import Markdown from '../Common/Markdown'
import apiClient from '../../util/apiClient'
import styles from '../../styles'

interface ControlReportsProps {
  entryId: string
  controlReports: ControlReport[]
  stateChanges?: EntryStateChange[]
  entryState?: string | null
  parts?: string[]
  onUpdate: () => void
  isAdminView?: boolean
}

const ControlReports = ({
  entryId,
  controlReports,
  stateChanges,
  entryState,
  parts,
  onUpdate,
  isAdminView = false,
}: ControlReportsProps) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<ControlReport | null>(null)
  const [text, setText] = useState('')
  const [adminOnly, setAdminOnly] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showStateSelector, setShowStateSelector] = useState(false)
  const [pendingState, setPendingState] = useState<EntryState | null>(null)
  const [stateConfirmOpen, setStateConfirmOpen] = useState(false)

  const effectiveState = entryState ?? (controlReports.length > 0 ? ENTRY_STATES.EXPERT_GROUP : null)

  const handleStateChange = async (newState: EntryState) => {
    try {
      await apiClient.patch(`/entries/${entryId}/state`, { state: newState })
      onUpdate()
    } catch (error) {
      enqueueSnackbar('Tilan päivitys epäonnistui', { variant: 'error' })
    }
  }

  const handleStateSelect = (newState: EntryState) => {
    setPendingState(newState)
    setStateConfirmOpen(true)
    setShowStateSelector(false)
  }

  const handleStateConfirm = async () => {
    if (!pendingState) {
      return
    }
    setStateConfirmOpen(false)
    await handleStateChange(pendingState)
    setPendingState(null)
  }

  const handleStateConfirmCancel = () => {
    setStateConfirmOpen(false)
    setPendingState(null)
  }

  const { cardStyles } = styles

  const isAdmin = user?.isAdmin && isAdminView
  const canAddReport = isAdmin && effectiveState !== null

  const handleOpenDialog = (report?: ControlReport) => {
    if (report) {
      setEditingReport(report)
      setText(report.text)
      setAdminOnly(report.adminOnly)
    } else {
      setEditingReport(null)
      setText('')
      setAdminOnly(false)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingReport(null)
    setText('')
    setAdminOnly(false)
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
        adminOnly,
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
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        {t('controlReport:title')}
      </Typography>
      {parts && parts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('controlReport:thresholdsExceeded')}
          </Typography>
          <Box component="ul" sx={{ mt: 0, pl: 3 }}>
            {parts.map(part => (
              <li key={part}>
                <Typography variant="body2">{t(part)}</Typography>
              </li>
            ))}
          </Box>
        </Box>
      )}
      {effectiveState && (
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {t('controlReport:stateLabel')}
        </Typography>
      )}
      {isAdmin && effectiveState ? (
        <Box sx={{ mb: 2 }}>
          {showStateSelector ? (
            <FormControl size="small">
              <RadioGroup
                value={effectiveState ?? ''}
                onChange={e => {
                  handleStateSelect(e.target.value as EntryState)
                }}
              >
                {Object.values(ENTRY_STATES).map(state => (
                  <FormControlLabel
                    key={state}
                    value={state}
                    control={<Radio size="small" />}
                    label={t(getEntryStateLabel(state))}
                  />
                ))}
              </RadioGroup>
              <Button size="small" onClick={() => setShowStateSelector(false)} sx={{ alignSelf: 'flex-start', mt: 1 }}>
                {t('controlReport:cancelButton')}
              </Button>
            </FormControl>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {effectiveState && (
                <Chip
                  label={t(getEntryStateLabel(effectiveState))}
                  color={getEntryStateColor(effectiveState)}
                  sx={getEntryStateSx(effectiveState)}
                />
              )}
              <Button size="small" onClick={() => setShowStateSelector(true)}>
                {t('controlReport:changeState')}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        effectiveState && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={t(getEntryStateLabel(effectiveState))}
              color={getEntryStateColor(effectiveState)}
              sx={getEntryStateSx(effectiveState)}
            />
          </Box>
        )
      )}

      {isAdmin && !effectiveState && controlReports.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('controlReport:riskLevel3Required')}
        </Alert>
      )}

      {isAdmin && stateChanges && stateChanges.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('controlReport:stateHistory')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {stateChanges
              .slice()
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map(change => (
                <Typography key={change.id} variant="body2" color="text.secondary">
                  {formatDate(change.createdAt)} &middot; {change.changedBy} &middot;{' '}
                  {change.fromState ? t(getEntryStateLabel(change.fromState as any)) : '—'}
                  {' → '}
                  {t(getEntryStateLabel(change.toState as any))}
                </Typography>
              ))}
          </Box>
        </Box>
      )}

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        {t('controlReport:subTitle')}
      </Typography>

      {controlReports.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('controlReport:noReports')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {controlReports
            .filter(report => !report.adminOnly || isAdmin)
            .map(report => (
              <Card key={report.id} variant="outlined" sx={report.adminOnly ? { borderStyle: 'dashed' } : {}}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('controlReport:createdBy')}: {report.createdBy}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                        {t('controlReport:lastUpdated')}: {formatDate(report.updatedAt)}
                      </Typography>
                      {report.adminOnly && (
                        <Chip label={t('controlReport:adminOnly')} size="small" color="warning" sx={{ ml: 2 }} />
                      )}
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

      {canAddReport && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            {t('controlReport:addButton')}
          </Button>
        </Box>
      )}

      {isAdmin && controlReports.length > 0 && <Box sx={{ mt: 3 }}>{/* state selector moved to top */}</Box>}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingReport ? t('controlReport:editButton') : t('controlReport:addButton')}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={6}
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            sx={{ mt: 1 }}
          />
          <FormControlLabel
            control={<Checkbox checked={adminOnly} onChange={e => setAdminOnly(e.target.checked)} />}
            label={t('controlReport:adminOnly')}
          />
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

      {/* State Change Confirmation Dialog */}
      <Dialog open={stateConfirmOpen} onClose={handleStateConfirmCancel}>
        <DialogTitle>{t('controlReport:confirmStateChangeTitle')}</DialogTitle>
        <DialogContent>
          <Typography>
            {effectiveState ? t(getEntryStateLabel(effectiveState)) : '—'}
            {' → '}
            {pendingState ? t(getEntryStateLabel(pendingState)) : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStateConfirmCancel}>{t('controlReport:cancelButton')}</Button>
          <Button onClick={handleStateConfirm} variant="contained">
            {t('controlReport:confirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ControlReports
