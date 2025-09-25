import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Box, Button } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import type { Locales, Result } from '@types'

import { useEditResultMutation } from '../../../hooks/useResultMutation'

const ResultItem = ({ language, result }: { language: keyof Locales; result: Result }) => {
  const { t } = useTranslation()
  const mutation = useEditResultMutation(result.id)

  const { data, isSelected } = result

  const [resultIsSelected, setResultIsSelected] = useState<any>('')

  useEffect(() => {
    setResultIsSelected(isSelected[language])
  }, [language, isSelected])

  const handleSave = async () => {
    isSelected[language] = resultIsSelected

    try {
      await mutation.mutateAsync({ data, isSelected })
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  if (!resultIsSelected) {
    return null
  }

  return (
    <Box
      sx={{
        p: 2,
        my: 4,
        mx: 4,
        width: '50%',
        '&:hover': {
          border: 1,
          borderColor: '#0288d1',
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <MDEditor data-color-mode="light" height={200} value={resultIsSelected} onChange={setResultIsSelected} />
      </Box>

      <Button variant="outlined" onClick={handleSave}>
        {t('admin:save')}
      </Button>
    </Box>
  )
}

const EditResult = ({ language, result }: { language: keyof Locales; result: Result }) => (
  <Box mb={5} display="flex">
    <ResultItem language={'fi' as keyof Locales} result={result} />
    <ResultItem language={language} result={result} />
  </Box>
)

export default EditResult
