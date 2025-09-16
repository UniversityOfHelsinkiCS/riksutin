import type { InputProps } from '@client/types'
import { useTranslation } from 'react-i18next'

const MultilateralInfo = ({ watch, question }: InputProps) => {
  const { t } = useTranslation()
  if (!watch || !question) {
    return null
  }

  const highRisks = watch()[26] ? watch()[26] : []
  const noRisks = watch()[28] ? watch()[28] : []

  return (
    <div>
      {t('questions:multilateralInfo')} {highRisks.length + noRisks.length}
    </div>
  )
}

export default MultilateralInfo
