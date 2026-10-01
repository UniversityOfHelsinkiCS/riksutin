import { SxProps, Theme, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { formatDateTime } from '../../util/formatDate'

const UpdatedAt = ({
  updatedAt,
  createdAt,
  sx = { mx: 4 },
}: {
  updatedAt?: string | Date
  createdAt?: string | Date
  sx?: SxProps<Theme>
}) => {
  const { t } = useTranslation()

  if (!updatedAt) {
    return null
  }

  return (
    <Typography variant="body2" color="text.secondary" sx={sx}>
      {t('admin:updated')}: {formatDateTime(updatedAt)}
      {createdAt && ` · ${t('admin:created')}: ${formatDateTime(createdAt)}`}
    </Typography>
  )
}

export default UpdatedAt
