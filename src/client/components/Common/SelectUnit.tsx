import { useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Box, Autocomplete, TextField, Typography } from '@mui/material'

import type { FacultyOrUnit, Locales } from '@types'
import type { InputProps } from '@client/types'

import useUnits from '../../hooks/useUnits'

import { extraOrganisations } from '@common/organisations'

import styles from '../../styles'
import { useResultData } from 'src/client/contexts/ResultDataContext'

const sortFaculties = (faculties: FacultyOrUnit[]) => {
  return faculties.sort((a, b) => a.code?.localeCompare(b.code) ?? 0)
}

const { cardStyles } = styles

const SelectUnit = ({ control }: InputProps) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const [unit, setUnit] = useState<string>()
  const { faculties: units, isLoading: unitsLoading } = useUnits()
  const { resultData } = useResultData()

  useEffect(() => {
    setUnit(resultData.unit)
  }, [resultData])

  if (unitsLoading || !units) {
    return null
  }

  const selectedUnit = units.find(u => u.code === unit)

  const sortedUnits = sortFaculties(units)
  const organisations = sortedUnits.concat(extraOrganisations)

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
        defaultValue={unit}
        rules={{ required: true }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Box justifyContent="center">
            <Autocomplete
              disablePortal
              id={'unit'}
              options={organisations}
              getOptionLabel={option => `${option.code} - ${option.name[language as keyof Locales]}`}
              onChange={(e, data) => {
                onChange(data?.code)
              }}
              value={selectedUnit}
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
    </Box>
  )
}

export default SelectUnit
