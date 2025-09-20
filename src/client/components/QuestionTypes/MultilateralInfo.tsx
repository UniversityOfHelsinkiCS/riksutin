import type { InputProps } from '@client/types'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const MultilateralInfo = ({ watch, question }: InputProps) => {
  const { t } = useTranslation()
  if (!watch || !question) {
    return null
  }

  const highRisks = watch()[26] ? watch()[26] : []
  const noRisks = watch()[28] ? watch()[28] : []

  return (
    <div style={{ marginTop: -20 }}>
      <Typography sx={{ fontStyle: 'italic' }}>
        {t('questions:multilateralInfo')} {highRisks.length + noRisks.length}
      </Typography>
    </div>
  )
}

export default MultilateralInfo
