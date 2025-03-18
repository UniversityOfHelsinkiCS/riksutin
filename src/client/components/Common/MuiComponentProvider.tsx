import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import { ComponentProvider } from '@resultRenderer/context'
import Markdown from './Markdown'
import { useTranslation } from 'react-i18next'

/**
 * Implements component provider needed by resultRenderer with MUI components
 */
const MuiComponentProvider = ({ children }) => {
  const { t, i18n } = useTranslation()
  return (
    <ComponentProvider
      components={{
        Div: Box,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableRow,
        Typography,
        Markdown,
        t,
        language: i18n.language,
      }}
    >
      {children}
    </ComponentProvider>
  )
}
export default MuiComponentProvider
