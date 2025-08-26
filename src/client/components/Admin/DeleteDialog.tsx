import { useTranslation } from 'react-i18next'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import Markdown from '../Common/Markdown'

const DeleteDialog = ({
  open,
  title,
  content,
  onSubmit,
  setOpen,
}: {
  open: boolean
  title: string
  content: string
  onSubmit: (data: object, e?: Event) => Promise<void>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={() => setOpen(!open)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Markdown>{content}</Markdown>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onSubmit}>
          {t('admin:confirm')}
        </Button>
        <Button variant="outlined" onClick={() => setOpen(!open)}>
          {t('admin:cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
