import MDEditor from '@uiw/react-md-editor'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'

import type { Warning } from '@types'

import useCountries from '../../../hooks/useCountries'
import { useCreateWarning, useEditWarning } from '../../../hooks/useWarnings'

type WarningFormValues = {
  country: string
  fi: string
  en: string
  expiryDate: string
}

const toFormValues = (warning: Warning | null): WarningFormValues => ({
  country: warning?.country ?? '',
  fi: warning?.text.fi ?? '',
  en: warning?.text.en ?? '',
  // Date input only accepts YYYY-MM-DD, the database returns a full timestamp
  expiryDate: warning?.expiry_date?.slice(0, 10) ?? '',
})

const WarningDialog = ({ warning, onClose }: { warning: Warning | null; onClose: () => void }) => {
  const { t } = useTranslation()
  const { countries } = useCountries()
  const { mutateAsync: createWarning } = useCreateWarning()
  const { mutateAsync: editWarning } = useEditWarning()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WarningFormValues>({ defaultValues: toFormValues(warning) })

  const onSubmit = async ({ country, fi, en, expiryDate }: WarningFormValues) => {
    const text = { fi, en }
    const expiry_date = expiryDate === '' ? null : expiryDate

    try {
      if (warning) {
        await editWarning({ ...warning, text, expiry_date, updatedAt: new Date().toISOString() })
      } else {
        await createWarning({ country, text, expiry_date })
      }
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
      onClose()
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const required = { required: t('admin:warningFieldRequired') }

  const title = warning
    ? `${t('admin:warningEdit')}: ${countries?.find(country => country.iso2Code === warning.country)?.name ?? warning.country}`
    : t('admin:warningAddNew')

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* Country is fixed once a warning exists, moving it means creating a new one */}
          {!warning && (
            <Controller
              name="country"
              control={control}
              rules={required}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={countries ?? []}
                  getOptionLabel={country => country.name}
                  isOptionEqualToValue={(option, selected) => option.iso2Code === selected.iso2Code}
                  value={countries?.find(country => country.iso2Code === value) ?? null}
                  onChange={(_event, country) => onChange(country?.iso2Code ?? '')}
                  sx={{ mt: 1, mb: 2 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('admin:country')}
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  )}
                />
              )}
            />
          )}

          {(['fi', 'en'] as const).map(language => (
            <Box key={language} sx={{ mb: 2 }}>
              <InputLabel error={!!errors[language]} sx={{ mb: 1 }}>
                {language === 'fi' ? t('admin:WarningInFinnish') : t('admin:WarningInEnglish')}
              </InputLabel>
              <Controller
                name={language}
                control={control}
                rules={required}
                render={({ field: { value, onChange } }) => (
                  <MDEditor
                    data-color-mode="light"
                    height={200}
                    value={value}
                    onChange={text => onChange(text ?? '')}
                  />
                )}
              />
              {errors[language] && (
                <Typography variant="caption" color="error">
                  {errors[language]?.message}
                </Typography>
              )}
            </Box>
          ))}

          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label={t('admin:ExpiryDate')}
                helperText={t('admin:warningExpiryDateHelp')}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ mt: 1 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            {t('admin:cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {t('admin:save')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default WarningDialog
