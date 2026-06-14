import { useCallback, useEffect, useMemo, useState } from 'react'
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
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { CONTROL_REPORT_TEMPLATE_LANGUAGES, CONTROL_REPORT_TEMPLATE_RISKS } from '@common/controlReportTemplate'
import { ControlReportTemplate, NewControlReportTemplate } from '@types'
import apiClient from '../../../util/apiClient'

const EMPTY_TEMPLATE: NewControlReportTemplate = {
  name: '',
  risks: ['riskComponent:total'],
  language: 'fi',
  text: '',
}

const ControlReportTemplates = () => {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState<ControlReportTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ControlReportTemplate | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<ControlReportTemplate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<NewControlReportTemplate>(EMPTY_TEMPLATE)

  const riskLabel = (risk: NewControlReportTemplate['risks'][number]) =>
    t(`controlReportTemplate:riskOption.${risk.replace('riskComponent:', '')}`)

  const templatesByLanguage = useMemo(
    () => ({
      fi: templates.filter(template => template.language === 'fi'),
      en: templates.filter(template => template.language === 'en'),
    }),
    [templates]
  )

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<ControlReportTemplate[]>('/control-report-templates')
      setTemplates(response.data)
    } catch (error) {
      enqueueSnackbar(t('controlReportTemplate:fetchError'), { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void fetchTemplates()
  }, [fetchTemplates])

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTemplate(null)
    setForm(EMPTY_TEMPLATE)
  }

  const openCreateDialog = () => {
    setEditingTemplate(null)
    setForm(EMPTY_TEMPLATE)
    setIsDialogOpen(true)
  }

  const openEditDialog = (template: ControlReportTemplate) => {
    setEditingTemplate(template)
    setForm({
      name: template.name,
      risks: template.risks,
      language: template.language,
      text: template.text,
    })
    setIsDialogOpen(true)
  }

  const saveTemplate = async () => {
    if (!form.name.trim()) {
      enqueueSnackbar(t('controlReportTemplate:nameRequired'), { variant: 'error' })
      return
    }

    if (!form.text.trim()) {
      enqueueSnackbar(t('controlReportTemplate:textRequired'), { variant: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      if (editingTemplate) {
        await apiClient.put(`/control-report-templates/${editingTemplate.id}`, form)
        enqueueSnackbar(t('controlReportTemplate:updateSuccess'), { variant: 'success' })
      } else {
        await apiClient.post('/control-report-templates', form)
        enqueueSnackbar(t('controlReportTemplate:createSuccess'), { variant: 'success' })
      }
      closeDialog()
      await fetchTemplates()
    } catch (error: any) {
      enqueueSnackbar(
        editingTemplate ? t('controlReportTemplate:updateError') : t('controlReportTemplate:createError'),
        {
          variant: 'error',
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) {
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.delete(`/control-report-templates/${templateToDelete.id}`)
      enqueueSnackbar(t('controlReportTemplate:deleteSuccess'), { variant: 'success' })
      setTemplateToDelete(null)
      setIsDeleteDialogOpen(false)
      await fetchTemplates()
    } catch (error) {
      enqueueSnackbar(t('controlReportTemplate:deleteError'), { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderLanguageSection = (language: 'fi' | 'en') => {
    const languageName =
      language === 'fi' ? t('controlReportTemplate:languageFinnish') : t('controlReportTemplate:languageEnglish')
    const items = templatesByLanguage[language]

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {languageName}
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('controlReportTemplate:noTemplates')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {items.map(template => (
              <Card key={template.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {template.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        {template.risks.map(risk => (
                          <Chip key={risk} label={riskLabel(risk)} size="small" />
                        ))}
                      </Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {template.text}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => openEditDialog(template)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setTemplateToDelete(template)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('controlReportTemplate:title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          {t('controlReportTemplate:addButton')}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('controlReportTemplate:description')}
      </Typography>

      {isLoading ? (
        <Typography variant="body2">{t('controlReportTemplate:loading')}</Typography>
      ) : (
        <>
          {renderLanguageSection('fi')}
          {renderLanguageSection('en')}
        </>
      )}

      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? t('controlReportTemplate:editButton') : t('controlReportTemplate:addButton')}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('controlReportTemplate:nameLabel')}
            value={form.name}
            onChange={event => {
              setForm(current => ({ ...current, name: event.target.value }))
            }}
            sx={{ mt: 1, mb: 2 }}
          />
          <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{t('controlReportTemplate:riskLabel')}</InputLabel>
              <Select
                multiple
                value={form.risks}
                label={t('controlReportTemplate:riskLabel')}
                onChange={event => {
                  setForm(current => ({
                    ...current,
                    risks: event.target.value as NewControlReportTemplate['risks'],
                  }))
                }}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map(risk => (
                      <Chip key={risk} label={riskLabel(risk)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {CONTROL_REPORT_TEMPLATE_RISKS.map(risk => (
                  <MenuItem key={risk} value={risk}>
                    <Checkbox checked={form.risks.includes(risk)} />
                    <ListItemText primary={riskLabel(risk)} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('controlReportTemplate:languageLabel')}</InputLabel>
              <Select
                value={form.language}
                label={t('controlReportTemplate:languageLabel')}
                onChange={event => {
                  setForm(current => ({
                    ...current,
                    language: event.target.value as NewControlReportTemplate['language'],
                  }))
                }}
              >
                {CONTROL_REPORT_TEMPLATE_LANGUAGES.map(language => (
                  <MenuItem key={language} value={language}>
                    {language === 'fi'
                      ? t('controlReportTemplate:languageFinnish')
                      : t('controlReportTemplate:languageEnglish')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            multiline
            minRows={6}
            fullWidth
            label={t('controlReportTemplate:textLabel')}
            value={form.text}
            onChange={event => {
              setForm(current => ({ ...current, text: event.target.value }))
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={isSubmitting}>
            {t('controlReportTemplate:cancelButton')}
          </Button>
          <Button onClick={saveTemplate} disabled={isSubmitting} variant="contained">
            {t('controlReportTemplate:saveButton')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>{t('controlReportTemplate:deleteButton')}</DialogTitle>
        <DialogContent>
          <Typography>{t('controlReportTemplate:confirmDelete')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
            {t('controlReportTemplate:cancelButton')}
          </Button>
          <Button onClick={confirmDeleteTemplate} color="error" variant="contained" disabled={isSubmitting}>
            {t('controlReportTemplate:deleteButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ControlReportTemplates
