import MDEditor from '@uiw/react-md-editor'
import { Box, Button } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, Control } from 'react-hook-form'

import type { Locales, Result } from '@types'
import { UpdatedResult } from '@validators/results'

import { useEditResultMutation } from '../../../hooks/useResultMutation'

const ResultItem = ({ language, control }: { language: keyof Locales; control: Control<UpdatedResult> }) => {
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
        <Controller
          name={`isSelected.${language}`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <MDEditor data-color-mode="light" height={200} value={value} onChange={onChange} />
          )}
        />
      </Box>
    </Box>
  )
}

const EditResult = ({ language, result }: { language: keyof Locales; result: Result }) => {
  const { t } = useTranslation()
  const mutation = useEditResultMutation(result.id)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdatedResult>({
    values: {
      isSelected: result.isSelected,
      data: result.data,
    } as UpdatedResult,
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const onSubmit = async (data: UpdatedResult) => {
    try {
      await mutation.mutateAsync(data)
      enqueueSnackbar(t('admin:saveSuccess'), { variant: 'success' })
      reset(data)
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex' }}>
        <ResultItem language="fi" control={control} />
        <ResultItem language={language} control={control} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
        <Button variant="contained" disabled={!isDirty} type="submit">
          {t('admin:save')}
        </Button>
      </Box>
    </Box>
  )
}

export default EditResult
