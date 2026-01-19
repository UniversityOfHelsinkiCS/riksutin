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

  if (tuhatProjectsLoading || tuhatProjects === undefined) {
    return (
      <Box sx={cardStyles.questionsContainer}>
        <Box sx={{ marginBottom: '16px' }}>
          <Typography component="span" sx={{ color: 'red' }}>
            {'* '}
          </Typography>
          <Typography component="span">{question.title[language as keyof Locales]}</Typography>
        </Box>
        <Box>
          <Typography component="span" fontStyle={'italic'}>
            {t('tuhatProjectNotFound:defineProjectOwner')}
          </Typography>
        </Box>
      </Box>
    )
  }
  if (tuhatProjects?.length === 0) {
    return (
      <Box sx={cardStyles.questionsContainer}>
        <Box sx={{ marginBottom: '16px' }}>
          <Typography component="span" sx={{ color: 'red' }}>
            {'* '}
          </Typography>
          <Typography component="span">{question.title[language as keyof Locales]}</Typography>
        </Box>
        <Controller
          control={control}
          key={'projektname'}
          name={question.id.toString()}
          rules={{ required: true }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box justifyContent="center">
              <TextField
                helperText={error ? error.message : null}
                error={!!error}
                data-testid={'question-projectText'}
                onChange={onChange}
                value={value}
                fullWidth
                placeholder={question.text[language as keyof Locales]}
              />
            </Box>
          )}
        />
      </Box>
    )
  }

  const projectOptionChosen = watch('tuhatProjectExists') || ''

  if (control._formValues.tuhatProjectExists === 'tuhatOptionNegative') {
    sessionStorage.setItem(TUHAT_DATA_STORAGE_KEY, '{}')
  }

  return (
    <Box sx={cardStyles.questionsContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ color: 'red' }}>
          {'* '}
        </Typography>
        <Typography component="span">{question.title[language as keyof Locales]}</Typography>
      </Box>
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
            <Box justifyContent="center">
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

      {projectOptionChosen === 'tuhatOptionPositive' && (
        <Controller
          control={control}
          key={'tuhatOptionPositive'}
          name={question.id.toString()}
          rules={{
            required: {
              value: projectOptionChosen === 'tuhatOptionPositive',
              message: 'Projektin nimi tarvitaan',
            },
          }}
          render={({ field }) => (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('tuhatProjectSelect:inputLabel')}</InputLabel>
              <Select data-cy="tuhatProject-select" label={t('tuhatProjectSelect:inputLabel')} {...field}>
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
            </FormControl>
          )}
        />
      )}

      {projectOptionChosen === 'tuhatOptionNegative' && (
        <Controller
          control={control}
          key={'tuhatOptionNegative'}
          name={question.id.toString()}
          rules={{
            required: {
              value: projectOptionChosen === 'tuhatOptionNegative',
              message: 'Projekti tarvitaan',
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box justifyContent="center">
              <TextField
                helperText={error ? error.message : null}
                error={!!error}
                data-testid={'question-tuhatProjText'}
                onChange={onChange}
                value={value}
                fullWidth
                placeholder={question.text[language as keyof Locales]}
              />
            </Box>
          )}
        />
      )}
    </Box>
  )
}

export default SelectTuhatProject
