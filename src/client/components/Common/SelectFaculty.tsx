import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'

import type { FacultyOrUnit, Locales } from '@types'
import type { InputProps } from '@client/types'

import useFaculties from '../../hooks/useFaculties'
import useUserFaculties from '../../hooks/useUserFaculties'

import ShowMore from './ShowMore'

import { extraOrganisations, organisationInfos } from '@common/organisations'

import styles from '../../styles'

const sortFaculties = (faculties: FacultyOrUnit[]) => {
  return faculties.sort((a, b) => a.code?.localeCompare(b.code) ?? 0)
}

const { cardStyles } = styles

const FacultyInfo = ({ faculty }: { faculty: FacultyOrUnit | null }) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n

  if (!faculty) {
    return null
  }

  const facultyInfo = organisationInfos.find(info => info.code === faculty?.code)

  if (!facultyInfo?.info[language as keyof Locales]) {
    return null
  }

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
  const [faculty, setFaculty] = useState<FacultyOrUnit | null>(null)
  const { faculties, isLoading: facultiesLoading } = useFaculties()
  const { userFaculties, isLoading: userFacultiesLoading } = useUserFaculties()

  useEffect(() => {
    if (userFacultiesLoading || !userFaculties) {
      return
    }

    const defaultFaculty = userFaculties.length > 0 ? userFaculties[0] : extraOrganisations[0]
    // eslint-disable-next-line no-console
    console.log('defaultFaculty', defaultFaculty)
    setFaculty(defaultFaculty)
  }, [userFaculties, userFacultiesLoading])

  if (facultiesLoading || !faculties || userFacultiesLoading || !userFaculties) {
    return null
  }

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
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('facultySelect:inputLabel')}</InputLabel>
            <Select data-cy="faculty-select" label={t('facultySelect:inputLabel')} {...field}>
              {organisations.map((f: FacultyOrUnit) => (
                <MenuItem
                  data-cy={`faculty-option-${f.code}`}
                  key={f.code}
                  value={f.code}
                  onClick={() => setFaculty(f)}
                  selected={faculty && f.code === faculty.code ? true : undefined}
                >
                  {f.code} - {f.name[language as keyof Locales]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <FacultyInfo faculty={faculty} />
    </Box>
  )
}

export default SelectFaculty
