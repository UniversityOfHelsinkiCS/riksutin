import { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Controller, useForm } from 'react-hook-form'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Autocomplete, Box, Button, Chip, TextField, Typography } from '@mui/material'

import { ShareResultEmails, ShareResultsZod } from '@validators/emails'

import type { Locales } from '@types'
import useLoggedInUser from '../../hooks/useLoggedInUser'

import SummaryEmailTemplate from '../../templates/SummaryEmailTemplate'

import styles from '../../styles'
import sendEmail from '../../util/mailing'

const SendSummaryEmail = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isSent, setIsSent] = useState(false)
  const { user, isLoading } = useLoggedInUser()

  const { language } = i18n

  const { cardStyles } = styles

  const resultHTML = sessionStorage.getItem('riksutin-session-resultHTML')

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: zodResolver(ShareResultsZod),
    defaultValues: {
      emails: [''],
    },
  })

  useEffect(() => {
    setIsSent(false)
  }, [resultHTML])

  useEffect(() => {
    if (user?.email) reset({ emails: [user?.email] })
  }, [reset, user])

  const onSubmit = ({ emails }: ShareResultEmails) => {
    if (errors?.emails || emails.length === 0) return

    const summaryEmailTemplate = ReactDOMServer.renderToString(
      <SummaryEmailTemplate language={language as keyof Locales} />
    )

    const subject = t('results:summaryEmailSubject')
    const text = `
    ${summaryEmailTemplate}

    ${resultHTML}
    `

    sendEmail(emails, text, subject)
      .then(() => {
        setIsSent(true)
        enqueueSnackbar(t('results:sendSuccess'), {
          variant: 'success',
        })
      })
      .catch(() => {
        enqueueSnackbar(t('contact:emailErrorMessage'), { variant: 'error' })
      })
  }

  if (isLoading || !user?.email || location.pathname === '/public') return null

  return (
    <Box sx={cardStyles.nestedSubSection}>
      <Typography variant="body1">{t('results:proceedEmailInfoText')}</Typography>
      <Box sx={cardStyles.content}>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="emails"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  data-cy="share-results"
                  size="small"
                  multiple
                  options={[]}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  disabled={isSent}
                  onChange={(_, data) => field.onChange(data)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        data-cy={`share-results-chip-${option}`}
                        key={option as unknown as string}
                        variant="outlined"
                        label={option}
                        color={errors.emails?.[index] ? 'error' : 'success'}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      data-cy="share-results-input"
                      size="small"
                      margin="dense"
                      variant="outlined"
                      placeholder={t('results:summaryEmailSharePlaceholder') ?? ''}
                      error={!!errors?.emails}
                      disabled={isSent}
                    />
                  )}
                />
              )}
            />
            <Button
              data-cy="summary-email-button"
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={!user?.email || isSent}
            >
              {t('results:sendSummaryMail')}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default SendSummaryEmail
