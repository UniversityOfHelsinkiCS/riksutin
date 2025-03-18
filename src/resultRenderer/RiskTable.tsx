// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'

import type { CountryData, Locales, Risk, RiskData } from '@types'

import RiskElement from './RiskElement'

import styles from './styles'
import { useComponents } from './context'
import { globalNorthCountries } from '@common/countryLists'
import getRiskTexts from '@common/getRiskTexts'
import getCountryRiskTexts from '@common/getCountryRiskTexts'

const { resultStyles } = styles

const RiskTable = ({
  riskData,
  countryData,
  countries,
  results,
}: {
  riskData: RiskData
  countryData: CountryData
  countries: any
  results: any
}) => {
  const { Div, Typography, TableContainer, Table, TableBody, TableRow, TableCell, t, language } = useComponents()

  const selectedCountry: string = riskData.answers['8']
  const selectedCountryCode = countries.find(country => country.name === selectedCountry)?.iso2Code

  const totalRisk = riskData.risks.find(risk => risk.id === 'total')
  const countryRisk = riskData.risks.find(risk => risk.id === 'country')

  if (!totalRisk) return null

  let totalRiskText = results.find(r => r.optionLabel === `total${totalRisk.level}`)?.isSelected[
    language as keyof Locales
  ]

  if (selectedCountryCode === 'RU' || selectedCountryCode === 'BY') {
    totalRiskText += t('countrySpecificTexts:RU')
  }

  let countryInfoText =
    results.find(r => r.optionLabel === `country${countryRisk?.level}`)?.isSelected[language as keyof Locales] ?? ''

  if (selectedCountryCode === 'CN') {
    countryInfoText += t('countrySpecificTexts:CN')
  } else if (!globalNorthCountries.includes(selectedCountryCode)) {
    countryInfoText += t('countrySpecificTexts:globalSouth')
  }

  const countryRisksWithTexts = getCountryRiskTexts(countryData, results, riskData.answers, language)

  const otherRisksWithTexts = getRiskTexts(riskData.risks, results, riskData.answers, language)

  return (
    <>
      <Typography data-cy="result-section-title" variant="h6" style={{ marginBottom: '20px', fontSize: '24px' }}>
        {t('results:riskTableTitle')}
      </Typography>
      <Div style={resultStyles.resultElementWrapper}>
        <TableContainer>
          <Table
            sx={{
              width: '80%',
              '& .MuiTableCell-sizeMedium': {
                padding: '10px',
              },
            }}
          >
            <TableBody>
              <RiskElement infoText={totalRiskText} title={totalRisk.title} level={totalRisk.level} />
              <TableRow>
                <TableCell colSpan={3}>
                  <Div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Typography variant="body1">{t('riskTable:multiplierInfoText')}</Typography>
                  </Div>
                </TableCell>
              </TableRow>
              {countryRisksWithTexts && countryRisk && (
                <>
                  <RiskElement
                    title={t('riskTable:countryRiskLevel')}
                    level={countryRisk.level}
                    infoText={countryInfoText}
                  />
                  {countryRisksWithTexts.map((risk: Risk) => (
                    <RiskElement
                      key={risk.id}
                      level={risk.level}
                      title={risk.title}
                      infoText={risk.infoText}
                      style={{ paddingLeft: '10px' }}
                    />
                  ))}
                </>
              )}
              {otherRisksWithTexts?.map(
                risk =>
                  !['country', 'total'].includes(risk.id) && (
                    <RiskElement key={risk.id} title={risk.title} level={risk.level} infoText={risk.infoText} />
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
