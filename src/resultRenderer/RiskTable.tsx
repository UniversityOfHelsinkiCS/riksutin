// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'

import type { CountryData, Locales, RiskData } from '@types'

import RiskElement from './RiskElement'

import styles from './styles'
import { useComponents } from './context'
import getRiskTexts from '@common/getRiskTexts'
import getCountryRiskTexts from '@common/getCountryRiskTexts'
import CountryRiskElements from './CountryRiskElements'
import { Alert } from '@mui/material'

const { resultStyles } = styles

const RiskTable = ({
  riskData,
  countryData,
  results,
  warnings,
}: {
  riskData: RiskData
  countryData: CountryData
  countries: any
  results: any
  warnings: any
}) => {
  const { Div, Typography, TableContainer, Table, TableBody, TableRow, TableCell, t, language } = useComponents()
  const totalRisk = riskData.risks.find(risk => risk.id === 'total')
  const countryRisk = riskData.risks.find(risk => risk.id === 'country')
  const totalEconomicRisk = riskData.risks.find(risk => risk.id === 'economic')

  if (!totalRisk || !totalEconomicRisk || !countryData) {
    return null
  }

  const totalRiskText = results.find(r => r.optionLabel === `total${totalRisk.level}`)?.isSelected[
    language as keyof Locales
  ]

  const countryRisksWithTexts = getCountryRiskTexts(countryData, results, riskData.answers, language)
  const otherRisksWithTexts = getRiskTexts(riskData.risks, results, riskData.answers, language)
  // Some older non-updated risk results do not contain economiScope, and those should have its text in
  // total economic risk.
  const riskWithEconomicScope =
    otherRisksWithTexts && otherRisksWithTexts.filter(risk => risk.id === 'economicScope').length > 0 ? true : false

  const hyMultilateral = riskData.answers['9'] === 'coordinator' && riskData.answers['4'] === 'multilateral'

  const outdated = hyMultilateral && !riskData.multilateralCountries

  const forMultilateral = risk => {
    if (risk.id !== 'consortium') {
      return true
    }

    return hyMultilateral
  }

  const multiplierArray = [
    riskData.answers['9'] === 'coordinator' ? t('riskTable:roleMultiplier') : '',
    riskData.answers['12'] === 'longDuration' ? t('riskTable:durationMultiplier') : '',
    riskData.answers['10'] === 'agreementNotDone' ? t('riskTable:agreementMultiplier') : '',
    riskData.answers['24'] === 'noSuccessfulCollaboration' ? t('riskTable:previousCollaborationMultiplier') : '',
  ]

  const economiAdditionalArray = [
    riskData.answers['14'] && riskData.answers['14'] === 'notPreviouslyFunded' ? t('riskTable:previousFunding') : '',
    riskData.answers['15'] &&
    (riskData.answers['15'] === 'internationalCompany' || riskData.answers['15'] === 'finnishCompany')
      ? t('riskTable:companyBased')
      : '',
  ]

  const multiplierInfoText =
    multiplierArray.filter(m => m !== '').length > 0
      ? t(
          `${t('riskTable:riskMultipliers')} ${multiplierArray
            .filter(m => m !== '')
            .join(', ')
            .replace(/,(?=[^,]+$)/, ` ${t('riskTable:and')}`)}.`
        )
      : ''

  const economiAdditionalInfoText =
    economiAdditionalArray.filter(m => m !== '').length > 0
      ? t(
          `${t('riskTable:economicAdditional')} ${economiAdditionalArray
            .filter(m => m !== '')
            .join(', ')
            .replace(/,(?=[^,]+$)/, ` ${t('riskTable:and')}`)}.`
        )
      : riskWithEconomicScope
        ? ' '
        : results.find(r => r.optionLabel === `economicScope${totalEconomicRisk.level}`)?.isSelected[
            language as keyof Locales
          ]

  return (
    <>
      {outdated && (
        <Alert severity="error" sx={{ marginBottom: 5 }}>
          {t('results:outdated')}
        </Alert>
      )}
      <Typography data-cy="result-section-title" variant="h6" style={{ marginBottom: '20px', fontSize: '24px' }}>
        {t('results:riskTableTitle')}
      </Typography>
      <Div style={resultStyles.resultElementWrapper}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <RiskElement infoText={totalRiskText} title={totalRisk.title} level={totalRisk.level} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>
                  <Div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Typography variant="body1">{multiplierInfoText}</Typography>
                  </Div>
                </TableCell>
              </TableRow>
              {countryRisksWithTexts && countryRisk && (
                <>
                  <CountryRiskElements
                    riskData={riskData}
                    countryData={countryData}
                    countries={results}
                    warnings={warnings}
                    results={results}
                  />
                </>
              )}
              {otherRisksWithTexts?.map(
                risk =>
                  ['university', 'consortium'].includes(risk.id) &&
                  forMultilateral(risk) && (
                    <TableRow key={risk.id}>
                      <TableCell colSpan={3} sx={{ borderBottom: 'none' }}>
                        <RiskElement title={risk.title} level={risk.level} infoText={risk.infoText} />
                      </TableCell>
                    </TableRow>
                  )
              )}
              {totalEconomicRisk && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ borderBottom: 'none' }}>
                    <RiskElement
                      infoText={economiAdditionalInfoText}
                      title={totalEconomicRisk.title}
                      level={totalEconomicRisk.level}
                    />
                  </TableCell>
                </TableRow>
              )}
              {otherRisksWithTexts?.map(
                risk =>
                  ['economicScope', 'economicExchange'].includes(risk.id) &&
                  forMultilateral(risk) && (
                    <TableRow key={risk.id}>
                      <TableCell colSpan={3} sx={{ paddingLeft: '35pt', borderBottom: 'none' }}>
                        <RiskElement title={risk.title} level={risk.level} infoText={risk.infoText} childCell />
                      </TableCell>
                    </TableRow>
                  )
              )}
              {otherRisksWithTexts?.map(
                risk =>
                  ['ethical', 'dualUse'].includes(risk.id) &&
                  forMultilateral(risk) && (
                    <TableRow key={risk.id}>
                      <TableCell colSpan={3} sx={{ borderBottom: 'none' }}>
                        <RiskElement title={risk.title} level={risk.level} infoText={risk.infoText} />
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Div>
    </>
  )
}

export default RiskTable
