// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'

import type { RiskData } from '@types'

import { useComponents } from './context'
import { riskColors } from './common'

import { Tooltip } from '@mui/material'

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

  const tip = option ? option.isSelected[language] : 'label not available'

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
  const risks = ['academicFreedom', 'hci', 'sanctions', 'stability', 'safetyLevel', 'corruption', 'ruleOfLaw']
  const { multilateralCountries } = riskData
  const { TableContainer, Table, TableBody, TableRow, TableCell, Div, t } = useComponents()

  const restMultilateral = multilateralCountries.slice(1)

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

  const width = `${70 / restMultilateral.length}%`

  return (
    <Div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              {restMultilateral.map(c => (
                <TableCell key={c.code}>{c.name}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>{t('riskTable:countryRiskLevel')}</TableCell>
              {restMultilateral.map(c => (
                <TableCell key={c.code}>
                  <Element level={c.countryRisk.totalCountryRiskLevel} id="country" results={results} />
                </TableCell>
              ))}
            </TableRow>
            {risks.map(riskId => (
              <TableRow key={riskId}>
                <TableCell sx={{ width: '30.0%' }}>{getLabelFor(riskId)}</TableCell>
                {restMultilateral.map(country => (
                  <TableCell key={country.code} sx={{ width }}>
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
