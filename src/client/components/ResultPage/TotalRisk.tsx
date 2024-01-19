import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material'
import { Question, Result, Locales } from '@backend/types'
import { euCountries } from '../../util/countryLists'
import { countryRisk, universityRisk } from '../../util/risks'

import useCountry from '../../hooks/useCountryData'
import { useResultData } from '../../contexts/ResultDataContext'

import CountryResults from './CountryResults'

import RiskElement from './RiskElement'

import styles from '../../styles'

const { resultStyles } = styles

const TotalRisk = ({
  selectedCountryCode,
  questions,
  results,
}: {
  selectedCountryCode: string | undefined
  questions: Question[]
  results: Result[]
}) => {
  const { t, i18n } = useTranslation()
  const { resultData } = useResultData()
  const { country } = useCountry(selectedCountryCode)

  if (!resultData) return null

  const { language } = i18n

  const possibleRiskLevels = [0, 1, 2, 3, 4, 5]

  const fundingRisk = questions
    .filter((question) => [14, 15].includes(question.id))
    ?.map(
      (question) =>
        question.optionData.options.find(
          (o) => o.id === resultData[question.id]
        )?.risk
    )
    .reduce((a, b) => a * b, 1)

  const funderRisk = questions
    .find((question) => question.id === 13)
    ?.optionData.options.find((o) => o.id === resultData[13])?.risk

  const durationRisk = questions
    .find((question) => question.id === 12)
    ?.optionData.options.find((o) => o.id === resultData[12])?.risk

  const dualUseRisk = () => {
    if (euCountries.includes(resultData[8])) return 1
    return questions
      .find((question) => question.id === 23)
      ?.optionData.options.find((o) => o.id === resultData[23])?.risk
  }

  const organisationRisk = () => {
    if (resultData.selectOrganisation) return 1
    if (
      !resultData.selectOrganisation &&
      resultData[24] === 'succefultCollaboration'
    )
      return 2
    if (
      !resultData.selectOrganisation &&
      resultData[24] === 'noSuccessfulCollaboration'
    )
      return 3
    return null
  }

  const riskArray = [
    {
      id: 'country',
      text: t('risks:countryRiskLevel'),
      riskLevel: countryRisk({ country, resultData }),
    },
    {
      id: 'university',
      text: t('risks:universityRiskLevel'),
      riskLevel: universityRisk(resultData['20'], resultData['21']),
    },
    {
      id: 'funder',
      text: t('risks:funderRiskLevel'),
      riskLevel: funderRisk,
    },
    {
      id: 'funding',
      text: t('risks:fundingRiskLevel'),
      riskLevel: fundingRisk,
    },
    {
      id: 'duration',
      text: t('risks:durationRiskLevel'),
      riskLevel: durationRisk,
    },
    {
      id: 'dualUse',
      text: t('risks:dualUseRiskLevel'),
      riskLevel: dualUseRisk(),
      infoText: results.find(
        (r) => r.optionLabel === `dualUseRiskLevel${dualUseRisk()}`
      )?.isSelected[language as keyof Locales],
    },
    {
      id: 'organisation',
      text: 'Organisaation riskitaso',
      riskLevel: organisationRisk(),
      infoText: results.find(
        (r) => r.optionLabel === `organisationRiskLevel${organisationRisk()}`
      )?.isSelected[language as keyof Locales],
    },
  ].filter((value) => possibleRiskLevels.includes(value.riskLevel))

  if (riskArray.length === 0) return null

  const totalRisk = Math.round(
    (riskArray.map((value) => value.riskLevel) as number[]).reduce(
      (a, b) => a + b,
      0
    ) / riskArray.length
  )

  const totalRiskText = results.find(
    (r) => r.optionLabel === `totalRiskLevel${totalRisk}`
  )?.isSelected[language as keyof Locales]

  return (
    <>
      <Typography data-cy="result-section-title" variant="h6" component="div">
        {t('results:riskTableTitle')}
      </Typography>
      <Box sx={resultStyles.resultElementWrapper}>
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
              <RiskElement
                infoText={totalRiskText}
                resultText={t('risks:totalRiskLevel')}
                risk={totalRisk}
              />
              {country && (
                <>
                  <RiskElement
                    resultText={t('risks:countryRiskLevel')}
                    risk={riskArray[0].riskLevel}
                    infoText={
                      riskArray[0].riskLevel === 1 ? t('risks:noRisk') : ''
                    }
                  />
                  {riskArray[0].riskLevel !== 1 && (
                    <CountryResults
                      country={country}
                      results={results}
                      resultData={resultData}
                    />
                  )}
                </>
              )}
              {riskArray.map(
                (risk) =>
                  risk.id !== 'country' && (
                    <RiskElement
                      key={risk.id}
                      resultText={risk.text}
                      risk={risk.riskLevel}
                      infoText={risk.infoText}
                    />
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

export default TotalRisk
