/* eslint-disable react/require-default-props */
import React from 'react'
import { Box, TableCell, TableRow } from '@mui/material'
import Markdown from '../Common/Markdown'

import styles from '../../styles'

const { resultStyles, riskColors } = styles

export interface RiskElementProps {
  infoText?: string | null | undefined
  resultText: string
  risk: number | null
  style?: any
}

const RiskElement = ({
  infoText,
  resultText,
  risk,
  style,
}: RiskElementProps) => {
  if (!risk) return null

  return (
    <TableRow>
      <TableCell width="30%">
        <Box sx={style}>
          <Markdown>{resultText}</Markdown>
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={[
            {
              backgroundColor: riskColors[risk > 3 ? 3 : risk],
            },
            resultStyles.tableCell,
          ]}
        >
          {risk > 3 ? 3 : risk}
        </Box>
      </TableCell>
      {infoText && (
        <TableCell sx={{ width: '90%' }}>
          <Markdown>{infoText}</Markdown>
        </TableCell>
      )}
    </TableRow>
  )
}

export default RiskElement
