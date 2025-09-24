import type { InputProps } from '@client/types'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { noDefault } from 'src/client/util/multilataral'

const MultilateralInfo = ({ watch, question }: InputProps) => {
  const { t } = useTranslation()
  if (!watch || !question) {
    return null
  }

  const highRisks = watch()[26] ? watch()[26].filter(noDefault) : []
  const noRisks = watch()[28] ? watch()[28].filter(noDefault) : []

  return (
    <div style={{ marginTop: 10 }}>
      <Typography sx={{ fontStyle: 'italic' }}>
        {t('questions:multilateralInfo')} {highRisks.length + noRisks.length}
      </Typography>
    </div>
  )
}

export default MultilateralInfo
