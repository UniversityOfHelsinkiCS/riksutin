import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'

import type { Faculty, Locales } from '@types'
import type { InputProps } from '@client/types'

// import useFaculties from '../../hooks/useFaculties'
import useUnits from '../../hooks/useUnits'
import useUserFaculties from '../../hooks/useUserFaculties'

import ShowMore from './ShowMore'

import { extraOrganisations, organisationInfos } from '@common/organisations'

import styles from '../../styles'

const sortFaculties = (faculties: Faculty[], language: keyof Locales) => {
  return faculties.sort((a, b) => a.name[language]?.localeCompare(b.name[language]!) ?? 0)
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
        {t('unitSelect:infoMessage')}
        <ShowMore text={facultyInfo.info[language as keyof Locales]} />
      </Typography>
    </Box>
  )
}

const SelectUnit = ({ control }: InputProps) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const [faculty, setFaculty] = useState<Faculty>()
  const { faculties, isLoading: facultiesLoading } = useUnits()
  const { userFaculties, isLoading: userFacultiesLoading } = useUserFaculties()

  useEffect(() => {
    if (userFacultiesLoading || !userFaculties) return

    setFaculty(userFaculties[0])
  }, [userFaculties, userFacultiesLoading])

  if (facultiesLoading || !faculties || userFacultiesLoading || !userFaculties) return null

  const sortedFaculties = sortFaculties(faculties, language as keyof Locales)
  const organisations = sortedFaculties.concat(extraOrganisations)

  return (
    <Box sx={cardStyles.questionsContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ color: 'red' }}>
          {'* '}
        </Typography>
        <Typography component="span">{t('unitSelect:title')}</Typography>
      </Box>
      <Controller
        control={control}
        name="unit"
        rules={{ required: true }}
        defaultValue={userFaculties[0]?.code || extraOrganisations[0].code}
        render={({ field }) => (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('unitSelect:inputLabel')}</InputLabel>
            <Select data-cy="unit-select" label={t('unitSelect:inputLabel')} {...field}>
              {organisations.map((f: Faculty) => (
                <MenuItem
                  data-cy={`faculty-option-${f.code}`}
                  key={f.code}
                  value={f.code}
                  onClick={() => setFaculty(f)}
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

export default SelectUnit
