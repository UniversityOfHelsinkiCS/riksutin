/* eslint-disable no-console */
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
  let userId = ''
  const [projectOwnerId, setProjectOwnerId] = useState<string>('')
  const { tuhatProjects, isLoading: tuhatProjectsLoading } = useTuhatProjects(projectOwnerId)

  useEffect(() => {
    if (userId) setProjectOwnerId(userId)
  }, [userId])

  if (!tuhatProjects || tuhatProjectsLoading || !question || !watch || !control) return null

  const projectOwnerField = watch('2')
  const projectOptionChosen = watch('tuhatProjectExists') || ''
  if (projectOwnerField?.username) userId = projectOwnerField.username
  if (control._formValues.tuhatProjectExists === 'tuhatOptionNegative')
    sessionStorage.setItem(TUHAT_DATA_STORAGE_KEY, '{}')
  console.log(projectOwnerField)
  console.log(userId)
  console.log(sessionStorage.getItem(TUHAT_DATA_STORAGE_KEY))
  console.log(projectOptionChosen)
  return (
    <Box sx={cardStyles.questionsContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ color: 'red' }}>
          {'* '}
        </Typography>
        <Typography component="span">{t('tuhatProjectExists:title')}</Typography>
      </Box>
      <Controller
        control={control}
        name="tuhatProjectExists"
        rules={{ required: true }}
        defaultValue={''}
        render={({ field }) => (
          <Box justifyContent="center">
            <FormControl sx={{ minWidth: 200 }}>
              <RadioGroup {...field}>
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
        )}
      />
      {projectOptionChosen === 'tuhatOptionPositive' && (
        <>
          <Box sx={{ marginBottom: '16px' }}>
            <Typography component="span" sx={{ color: 'red' }}>
              {'* '}
            </Typography>
            <Typography component="span">{question.title[language as keyof Locales]}</Typography>
          </Box>
          <Controller
            control={control}
            key={'tuhatOptionPositive'}
            name={question.id.toString()}
            rules={{
              required: {
                value: control._formValues.tuhatProjectExists === 'tuhatOptionPositive',
                message: 'Projektin nimi tarvitaan',
              },
            }}
            defaultValue={''}
            render={({ field }) => (
              <>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>{t('tuhatProjectSelect:inputLabel')}</InputLabel>
                  <Select data-cy="tuhatProject-select" label={t(' tuhatProjectSelect:inputLabel')} {...field}>
                    {tuhatProjects.map((c: TuhatData) => (
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
              </>
            )}
          />
        </>
      )}
      {projectOptionChosen === 'tuhatOptionNegative' && (
        <>
          <Box sx={{ marginBottom: '16px' }}>
            <Typography component="span" sx={{ color: 'red' }}>
              {'* '}
            </Typography>
            <Typography component="span">{question.title[language as keyof Locales]}</Typography>
          </Box>
          <Controller
            control={control}
            key={'tuhatOptionNegative'}
            name={question.id.toString()}
            rules={{
              required: {
                value: control._formValues.tuhatProjectExists === 'tuhatOptionNegative',
                message: 'Projekti tarvitaan',
              },
            }}
            defaultValue={''}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Box justifyContent="center">
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  data-testid={'question-tuhatProjText'}
                  onChange={onChange}
                  fullWidth
                  placeholder={question.text[language as keyof Locales]}
                />
              </Box>
            )}
          />
        </>
      )}
    </Box>
  )
}

export default SelectTuhatProject
