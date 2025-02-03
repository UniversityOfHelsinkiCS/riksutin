/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

import type { Faculty, Locales } from '@types'
import type { InputProps } from '@frontend/types'

import useFaculties from '../../hooks/useFaculties'
import useUserFaculties from '../../hooks/useUserFaculties'

import Markdown from './Markdown'
import ShowMore from './ShowMore'

import { extraOrganisations, organisationInfos } from '../../util/organisations'

import styles from '../../styles'

const sortFaculties = (faculties: Faculty[], language: keyof Locales) => {
  const sortedFaculties = faculties.sort((a, b) => {
    if (a.name[language] > b.name[language]) return 1
    if (a.name[language] < b.name[language]) return -1

    return 0
  })

  return sortedFaculties
}

const { cardStyles, formStyles } = styles

const FacultyInfo = ({ faculty }: { faculty: Faculty | undefined }) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n

  if (!faculty) return null

  const facultyInfo = organisationInfos.find(
    (info) => info.code === faculty?.code
  )

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

  if (facultiesLoading || !faculties || userFacultiesLoading || !userFaculties)
    return null

  const sortedFaculties = sortFaculties(faculties, language as keyof Locales)
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
        defaultValue={userFaculties[0]?.code || extraOrganisations[0].code}
        render={({ field }) => (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('facultySelect:inputLabel')}</InputLabel>
            <Select
              data-cy="faculty-select"
              label={t('facultySelect:inputLabel')}
              {...field}
            >
              {organisations.map((f: Faculty) => (
                <MenuItem
                  data-cy={`faculty-option-${f.code}`}
                  key={f.code}
                  value={f.code}
                  onClick={() => setFaculty(f)}
                >
                  {f.name[language as keyof Locales]}
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
