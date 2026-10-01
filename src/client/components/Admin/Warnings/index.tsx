import { useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import type { Warning } from '@types'

import useCountries from '../../../hooks/useCountries'
import { useDeleteWarning, useWarnings } from '../../../hooks/useWarnings'
import Markdown from '../../Common/Markdown'
import DeleteDialog from '../DeleteDialog'
import WarningDialog from './WarningDialog'

const formatDate = (date: string) => new Date(date).toLocaleDateString('fi-FI')

const isExpired = (warning: Warning) => !!warning.expiry_date && new Date(warning.expiry_date) < new Date()

const Warnings = () => {
  const { t } = useTranslation()
  const { warnings, isLoading } = useWarnings()
  const { countries } = useCountries()
  const { mutateAsync: deleteWarning } = useDeleteWarning()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWarning, setEditingWarning] = useState<Warning | null>(null)
  const [warningToDelete, setWarningToDelete] = useState<Warning | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const countryName = (code: string) => countries?.find(country => country.iso2Code === code)?.name ?? code

  // Newest first, so a just-added warning shows up at the top
  const sortedWarnings = [...(warnings ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const openCreateDialog = () => {
    setEditingWarning(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (warning: Warning) => {
    setEditingWarning(warning)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingWarning(null)
  }

  const confirmDelete = async () => {
    if (!warningToDelete) {
      return
    }

    try {
      await deleteWarning(String(warningToDelete.id))
      enqueueSnackbar(t('admin:deleteSuccess'), { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
    setIsDeleteDialogOpen(false)
    setWarningToDelete(null)
  }

  return (
    <Box sx={{ mx: 2, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('admin:allCountryWarnings')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          {t('admin:warningAddNew')}
        </Button>
      </Box>

      {!isLoading && sortedWarnings.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t('admin:warningNotFound')}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sortedWarnings.map(warning => (
          <Card key={warning.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {countryName(warning.country)}
                </Typography>
                {isExpired(warning) && <Chip label={t('admin:warningExpired')} size="small" color="warning" />}
              </Box>

              <Typography variant="overline">FI</Typography>
              <Markdown>{warning.text.fi}</Markdown>
              <Typography variant="overline">EN</Typography>
              <Markdown>{warning.text.en}</Markdown>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('admin:expire')}: {warning.expiry_date ? formatDate(warning.expiry_date) : '–'} ·{' '}
                {t('admin:updated')}: {formatDate(warning.updatedAt)} · {t('admin:created')}:{' '}
                {formatDate(warning.createdAt)}
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => openEditDialog(warning)}>
                {t('admin:edit')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setWarningToDelete(warning)
                  setIsDeleteDialogOpen(true)
                }}
              >
                {t('admin:delete')}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {isDialogOpen && <WarningDialog warning={editingWarning} onClose={closeDialog} />}

      <DeleteDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t('admin:warningRemoveInfo')}
        content={t('admin:warningRemoveContent', {
          country: warningToDelete ? countryName(warningToDelete.country) : '',
        })}
        onSubmit={confirmDelete}
      />
    </Box>
  )
}

export default Warnings
