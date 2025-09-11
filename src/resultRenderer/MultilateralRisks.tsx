// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'

import type { RiskData } from '@types'

import { useComponents } from './context'
import { riskColors } from './common'

import { Button, Tooltip } from '@mui/material'

const Element = ({ level, id, results }) => {
  const { Div, Typography } = useComponents()
  const { language } = useComponents()

  const getOptionLabel = (level, id) => {
    if (id === 'hci') {
      return 'HCI' + level
    }

    if (id === 'stability') {
      return 'politicalStability' + level
    }

    return id + level
  }

  const optLabel = getOptionLabel(level, id)

  const option = results.find(r => r.optionLabel === optLabel)

  const tip = option ? option.isSelected[language] : 'no clue what means'

  return (
    <Div
      style={{
        borderRadius: '10px',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: riskColors[level],
      }}
    >
      <Tooltip title={tip} placement="top">
        <Typography>{level > 3 ? '?' : level}</Typography>
      </Tooltip>
    </Div>
  )
}

const MultilateralRisks = ({ riskData, results }: { riskData: RiskData; results: any }) => {
  const [showTable, setShowTable] = useState(process.env.NODE_ENV === 'development')

  const risks = ['academicFreedom', 'hci', 'sanctions', 'stability', 'safetyLevel', 'corruption', 'ruleOfLaw']
  const { multilateralCountries } = riskData
  const { TableContainer, Table, TableBody, TableRow, TableCell, Div, t } = useComponents()

  if (!multilateralCountries) return null

  if (!showTable) {
    return (
      <Div>
        <Button variant="contained" onClick={() => setShowTable(!showTable)}>
          show multilateral risks
        </Button>
      </Div>
    )
  }

  const getLabelFor = (id: string) => {
    if (id === 'hci') {
      return t('riskTable:HCIrank')
    }
    if (id === 'corruption') {
      return t('riskTable:corruptionRank')
    }
    if (id === 'stability') {
      return t('riskTable:stabilityRank')
    }

    return t(`riskTable:${id}`)
  }

  return (
    <Div>
      <Button variant="contained" onClick={() => setShowTable(!showTable)}>
        hide multilateral risks
      </Button>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              {multilateralCountries.map(c => (
                <TableCell key={c.code}>{c.name}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>{t('riskTable:countryRiskLevel')}</TableCell>
              {multilateralCountries.map(c => (
                <TableCell key={c.code}>
                  <Element level={c.countryRisk.totalCountryRiskLevel} id="country" results={results} />
                </TableCell>
              ))}
            </TableRow>
            {risks.map(riskId => (
              <TableRow key={riskId}>
                <TableCell>{getLabelFor(riskId)}</TableCell>
                {multilateralCountries.map(country => (
                  <TableCell key={country.code}>
                    <Element level={country[riskId] ? country[riskId] : 4} id={riskId} results={results} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Div>
  )
}

export default MultilateralRisks
