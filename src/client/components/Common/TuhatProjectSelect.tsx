/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material'

import type { TuhatData, Locales, SingleChoiceType } from '@types'
import type { InputProps } from '@client/types'
import useTuhatProjects from '../../hooks/useTuhatProjects'

import styles from '../../styles'
import { TUHAT_DATA_STORAGE_KEY } from '@config'

const { cardStyles } = styles

const collabProjectOptions = [
  {
    id: 'tuhatOptionPositive',
    label: '',
    title: {
      fi: 'Kyllä',
      sv: 'Ja',
      en: 'Yes',
    },
  },
  {
    id: 'tuhatOptionNegative',
    label: '',
    title: {
      fi: 'Ei',
      sv: 'Nej',
      en: 'No',
    },
  },
]

const SelectTuhatProject = ({ control, question, watch }: InputProps) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const [projectOwnerId, setProjectOwnerId] = useState<string>(watch?.('2')?.username ? watch('2').username : '')
  const { tuhatProjects, isLoading: tuhatProjectsLoading } = useTuhatProjects(projectOwnerId)
  const projectOwnerField = watch?.('2') ?? ''
  useEffect(() => {
    if (projectOwnerField) {
      setProjectOwnerId(projectOwnerField.username)
    }
  }, [projectOwnerField])

  if (!question || !watch || !control) {
    return null
  }

  const projectOptionChosen = watch('tuhatProjectExists') || ''

  if (projectOptionChosen === 'tuhatOptionNegative') {
    sessionStorage.setItem(TUHAT_DATA_STORAGE_KEY, '{}')
  }

  const isLoadingOrNoOwner = tuhatProjectsLoading || tuhatProjects === undefined
  const noProjectsFound = tuhatProjects?.length === 0
  const hasProjects = tuhatProjects && tuhatProjects.length > 0

  return (
    <Box sx={cardStyles.questionsContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ color: 'red' }}>
          {'* '}
        </Typography>
        <Typography component="span">{question.title[language as keyof Locales]}</Typography>
      </Box>

      {hasProjects && (
        <Box>
          <Box sx={{ marginBottom: '16px' }}>
            <Typography component="span">{t('tuhatProjectExists:title')}</Typography>
          </Box>
          <Controller
            control={control}
            name="tuhatProjectExists"
            rules={{ required: true }}
            render={({ field }) => {
              const currentValue = field.value || ''
              return (
                <Box sx={{ justifyContent: 'center' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <RadioGroup {...field} value={currentValue}>
                      {collabProjectOptions.map((singleOption: SingleChoiceType) => (
                        <FormControlLabel
                          data-cy={`choice-select-${singleOption.id}`}
                          key={singleOption.id}
                          value={singleOption.id}
                          label={singleOption.title[language as keyof Locales]}
                          control={<Radio />}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )
            }}
          />
        </Box>
      )}

      <Controller
        control={control}
        name={question.id.toString()}
        rules={{
          required: {
            value: true,
            message: projectOptionChosen === 'tuhatOptionPositive' ? 'Projektin nimi tarvitaan' : 'Projekti tarvitaan',
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          if (isLoadingOrNoOwner) {
            return (
              <Box>
                <Typography component="span" sx={{ fontStyle: 'italic', color: error ? 'error.main' : 'inherit' }}>
                  {tuhatProjectsLoading
                    ? t('tuhatProjectNotFound:loading')
                    : t('tuhatProjectNotFound:defineProjectOwner')}
                </Typography>
              </Box>
            )
          }

          if (noProjectsFound || projectOptionChosen === 'tuhatOptionNegative') {
            return (
              <Box sx={{ justifyContent: 'center', mt: hasProjects ? 2 : 0 }}>
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  data-testid={noProjectsFound ? 'question-projectText' : 'question-tuhatProjText'}
                  onChange={onChange}
                  value={value || ''}
                  fullWidth
                  placeholder={question.text[language as keyof Locales]}
                />
              </Box>
            )
          }

          if (hasProjects && projectOptionChosen === 'tuhatOptionPositive') {
            return (
              <Box sx={{ mt: 2 }}>
                <FormControl sx={{ minWidth: 200 }} error={!!error}>
                  <InputLabel>{t('tuhatProjectSelect:inputLabel')}</InputLabel>
                  <Select
                    data-cy="tuhatProject-select"
                    label={t('tuhatProjectSelect:inputLabel')}
                    value={value || ''}
                    onChange={onChange}
                  >
                    {tuhatProjects?.map((c: TuhatData) => (
                      <MenuItem
                        data-cy={''}
                        key={c.tuhatId}
                        value={`${c.name[language as keyof Locales]}`}
                        onClick={() => sessionStorage.setItem(TUHAT_DATA_STORAGE_KEY, JSON.stringify(c))}
                      >
                        {c.name[language as keyof Locales]}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              </Box>
            )
          }

          return <></>
        }}
      />
    </Box>
  )
}

export default SelectTuhatProject
