/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useEffect, useState } from 'react'
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
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { RadioGroup } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import InfoIcon from '@mui/icons-material/Info'
import { useTranslation } from 'react-i18next'
import { enqueueSnackbar } from 'notistack'

import { ControlReport, ControlReportTemplate, EntryStateChange } from '@types'
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
  entryLanguage?: string
}

const ControlReports = ({
  entryId,
  controlReports,
  stateChanges,
  entryState,
  parts,
  onUpdate,
  isAdminView = false,
  entryLanguage,
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
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [templates, setTemplates] = useState<ControlReportTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [previewTemplateId, setPreviewTemplateId] = useState('')

  const riskLabel = (risk: ControlReportTemplate['risks'][number]) =>
    t(`controlReportTemplate:riskOption.${risk.replace('riskComponent:', '')}`)

  const truncateLabel = (label: string, maxLength = 26) =>
    label.length > maxLength ? `${label.slice(0, maxLength - 3)}...` : label

  const getTemplateRiskSummary = (template: ControlReportTemplate) => {
    const labels = template.risks.map(riskLabel)

    if (labels.length <= 1) {
      return labels.join(', ')
    }

    return labels.map(label => truncateLabel(label)).join(', ')
  }

  const effectiveState = entryState ?? (controlReports.length > 0 ? ENTRY_STATES.EXPERT_GROUP : null)
  const previewTemplate = templates.find(template => template.id === previewTemplateId) ?? null
  const largestPreviewTemplate = templates.reduce<ControlReportTemplate | null>((largest, current) => {
    if (!largest) {
      return current
    }
    return current.text.length > largest.text.length ? current : largest
  }, null)

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
    setTemplateDialogOpen(false)
    setEditingReport(null)
    setText('')
    setAdminOnly(false)
    setSelectedTemplateId('')
    setPreviewTemplateId('')
  }

  useEffect(() => {
    if (!isDialogOpen || !isAdmin || !entryLanguage) {
      return
    }

    const fetchTemplates = async () => {
      try {
        const response = await apiClient.get<ControlReportTemplate[]>(
          `/control-report-templates?language=${entryLanguage}`
        )
        setTemplates(response.data)
      } catch (error) {
        enqueueSnackbar(t('controlReport:templateLoadError'), { variant: 'error' })
      }
    }

    void fetchTemplates()
  }, [entryLanguage, isAdmin, isDialogOpen, t])

  const appendTemplate = (template: ControlReportTemplate) => {
    setText(currentText => {
      const trimmed = currentText.trim()
      if (!trimmed) {
        return template.text
      }
      return `${currentText}\n\n${template.text}`
    })
    setSelectedTemplateId('')
  }

  const handleOpenTemplateDialog = () => {
    setTemplateDialogOpen(true)
    setSelectedTemplateId('')
    setPreviewTemplateId('')
  }

  const handleCloseTemplateDialog = () => {
    setTemplateDialogOpen(false)
    setSelectedTemplateId('')
  }

  const handleApplyTemplate = () => {
    if (!selectedTemplateId) {
      return
    }

    const template = templates.find(item => item.id === selectedTemplateId)
    if (!template) {
      return
    }

    appendTemplate(template)
    setTemplateDialogOpen(false)
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
    <Box sx={cardStyles.nestedSubSection} data-testid="control-reports-section">
      {parts && parts.length > 0 && (
        <>
          <Alert
            severity="warning"
            icon={<InfoIcon sx={{ fontSize: '2rem', mr: 1.5 }} />}
            sx={{ mb: 2, '& .MuiAlert-icon': { alignItems: 'center' } }}
            data-testid="threshold-notification"
          >
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {t(isAdminView ? 'controlReport:thresholdNotificationAdmin' : 'controlReport:thresholdNotification')}
            </Typography>
          </Alert>
          <Box sx={{ mb: 2 }} data-testid="risk-threshold-parts">
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
        </>
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
                data-testid="state-selector"
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
                  data-testid="entry-state-chip"
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
              data-testid="entry-state-chip"
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

      {isAdmin && stateChanges && stateChanges.filter(sc => sc.changedBy !== 'system').length > 0 && (
        <Box sx={{ mb: 3 }} data-testid="state-change-history">
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('controlReport:stateHistory')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {stateChanges
              .slice()
              .filter(change => change.changedBy !== 'system')
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
              <Card
                key={report.id}
                variant="outlined"
                sx={report.adminOnly ? { borderStyle: 'dashed' } : {}}
                data-testid={report.adminOnly ? 'control-report-admin-only' : 'control-report-item'}
              >
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            data-testid="add-report-button"
          >
            {t('controlReport:addButton')}
          </Button>
        </Box>
      )}

      {isAdminView && entryLanguage && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`${t('userPage:filledInLanguage')}: ${new Intl.DisplayNames([entryLanguage], { type: 'language' }).of(entryLanguage)}`}
            size="small"
            variant="outlined"
          />
        </Box>
      )}

      {isAdmin && controlReports.length > 0 && <Box sx={{ mt: 3 }}>{/* state selector moved to top */}</Box>}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <span>{editingReport ? t('controlReport:editButton') : t('controlReport:addButton')}</span>
          {isAdmin && !editingReport && templates.length > 0 && (
            <Button variant="outlined" onClick={handleOpenTemplateDialog}>
              {t('controlReport:templateLabel')}
            </Button>
          )}
        </DialogTitle>
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

      {/* Template Selection Dialog */}
      <Dialog open={templateDialogOpen} onClose={handleCloseTemplateDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{t('controlReport:templateSelectTitle')}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 1,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 360px' },
            }}
          >
            <Box>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                {templates.map(template => {
                  const isSelected = selectedTemplateId === template.id
                  return (
                    <Button
                      key={template.id}
                      fullWidth
                      onClick={() => {
                        setSelectedTemplateId(template.id)
                        setPreviewTemplateId(template.id)
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        borderRadius: 0,
                        px: 2,
                        py: 1.25,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: isSelected ? 'action.selected' : 'transparent',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 500 }}>{template.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 0, fontSize: '0.68rem' }}>
                          {getTemplateRiskSummary(template)}
                        </Typography>
                      </Box>
                    </Button>
                  )
                })}
              </Box>
              <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-start' }}>
                <Button onClick={handleApplyTemplate} variant="contained" disabled={!selectedTemplateId}>
                  {t('controlReport:insertTemplateButton')}
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
                position: 'relative',
                minHeight: 140,
              }}
            >
              {largestPreviewTemplate && (
                <Box sx={{ p: 1.5, visibility: 'hidden', pointerEvents: 'none' }} aria-hidden>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {largestPreviewTemplate.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                    {largestPreviewTemplate.risks.map(risk => (
                      <Chip key={risk} label={riskLabel(risk)} size="small" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                    {largestPreviewTemplate.text}
                  </Typography>
                </Box>
              )}

              <Box sx={{ position: 'absolute', inset: 0, p: 1.5, overflowY: 'auto' }}>
                {previewTemplate && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {previewTemplate.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      {previewTemplate.risks.map(risk => (
                        <Chip key={risk} label={riskLabel(risk)} size="small" sx={{ fontSize: '0.7rem' }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                      {previewTemplate.text}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTemplateDialog}>{t('controlReport:cancelButton')}</Button>
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
