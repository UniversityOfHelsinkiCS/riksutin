import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'

import type { Faculty, Locales } from '@types'
import type { InputProps } from '@client/types'

import useFaculties from '../../hooks/useFaculties'
import useUserFaculties from '../../hooks/useUserFaculties'

import ShowMore from './ShowMore'

import { extraOrganisations, organisationInfos } from '@common/organisations'

import styles from '../../styles'

const sortFaculties = (faculties: Faculty[]) => {
  return faculties.sort((a, b) => a.code?.localeCompare(b.code) ?? 0)
}

const { cardStyles } = styles

const FacultyInfo = ({ faculty }: { faculty: Faculty | undefined }) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n

  if (!faculty) return null

  const facultyInfo = organisationInfos.find(info => info.code === faculty?.code)

  if (!facultyInfo?.info[language as keyof Locales]) return null

  return (
    <Box sx={cardStyles.content}>
      <Typography component="div">
        {t('facultySelect:infoMessage')}
        <ShowMore text={facultyInfo.info[language as keyof Locales]} />
      </Typography>
    </Box>
  )
}

const SelectFaculty = ({ control }: InputProps) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const [faculty, setFaculty] = useState<Faculty>()
  const { faculties, isLoading: facultiesLoading } = useFaculties()
  const { userFaculties, isLoading: userFacultiesLoading } = useUserFaculties()

  useEffect(() => {
    if (userFacultiesLoading || !userFaculties) return

    setFaculty(userFaculties[0])
  }, [userFaculties, userFacultiesLoading])

  if (facultiesLoading || !faculties || userFacultiesLoading || !userFaculties) return null
  const sortedFaculties = sortFaculties(faculties)
  const organisations = sortedFaculties.concat(extraOrganisations)

  return (
    <Box sx={cardStyles.questionsContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ color: 'red' }}>
          {'* '}
        </Typography>
        <Typography component="span">{t('facultySelect:title')}</Typography>
      </Box>
      <Controller
        control={control}
        name="faculty"
        defaultValue=""
        rules={{ required: true }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <Autocomplete
              disablePortal
              id={'faculty'}
              options={organisations}
              getOptionLabel={option => `${option.code} - ${option.name[language as keyof Locales]}`}
              onChange={(e, data) => {
                onChange(data?.code)
                setFaculty(data ?? undefined)
              }}
              sx={{ width: '50%' }}
              renderInput={params => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...params}
                  label={t('unitSelect:inputLabel')}
                />
              )}
            />
          </Box>
        )}
      />
      <FacultyInfo faculty={faculty} />
    </Box>
  )
}

export default SelectFaculty
