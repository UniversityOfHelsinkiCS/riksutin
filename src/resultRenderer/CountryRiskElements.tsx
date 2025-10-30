import React from 'react'

import type { CountryData, Risk, RiskData, Locales } from '@types'
import { Modal, Box, Button } from '@mui/material'
import RiskElement from './RiskElement'

import { useComponents } from './context'
import { globalSouthCountries } from '@common/countryLists'
import getCountryRiskTexts from '@common/getCountryRiskTexts'
import MultilateralRisks from './MultilateralRisks'
import { useTranslation } from 'react-i18next'

const MultilateralRiskMoral = ({ riskData, results }: { riskData: RiskData; results: any }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const { t } = useTranslation()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        {t('riskTable:otherCountriesRiskLevels')}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MultilateralRisks riskData={riskData} results={results} />
        </Box>
      </Modal>
    </>
  )
}

const asArray = field => {
  if (!field || field.length === 0) {
    return []
  }
  return field
}

const CountryRiskElements = ({
  riskData,
  countryData,
  countries,
  results,
  warnings,
}: {
  riskData: RiskData
  countryData: CountryData
  countries: any
  results: any
  warnings: any
}) => {
  const { TableRow, TableCell, Typography, Div, t, language } = useComponents()
  const selectedCountry: string = riskData.answers['8']
  const hyCordinatedMultilateral = riskData.answers['9'] === 'coordinator' && riskData.answers['4'] === 'multilateral'
  const highestRiskCountry = riskData.country[0]
  const multilateralCountyNames = asArray(riskData.answers['26']).concat(asArray(riskData.answers['28']))

  const selectedCountryCode = countries.find(country => country.name === selectedCountry)?.iso2Code

  const totalRisk = riskData.risks.find(risk => risk.id === 'total')
  const countryRisk = riskData.risks.find(risk => risk.id === 'country')

  if (!totalRisk || !countryData) {
    return null
  }

  let ekstraText = ''
  warnings.map(({ country, text, expiry_date }) => {
    if (country === countryData.code) {
      if (!expiry_date || new Date(expiry_date) >= new Date()) {
        ekstraText += text[language]
      }
    }
  })

  let countryInfoText =
    results.find(r => r.optionLabel === `country${countryRisk?.level}`)?.isSelected[language as keyof Locales] ?? ''

  if (globalSouthCountries.includes(selectedCountryCode)) {
    countryInfoText += '\n' + t('countrySpecificTexts:globalSouth')
  }

  const countryRisksWithTexts = getCountryRiskTexts(countryData, results, riskData.answers, language)

  return (
    <>
      {hyCordinatedMultilateral ? (
        <>
          <TableRow>
            <TableCell colSpan={3}>
              <Div component="div">
                <Typography style={{ fontWeight: '800', paddingBottom: 10 }}>
                  {t('riskTable:hyMultilateral')}
                </Typography>
                <Typography style={{ paddingBottom: 12 }}>
                  {t('riskTable:hyMultilateralCountries')}
                  <Typography component="span" fontStyle="italic" style={{ paddingLeft: 10 }}>
                    {multilateralCountyNames.join(', ')}
                  </Typography>
                </Typography>
                <Typography style={{ paddingBottom: 12 }}>{t('riskTable:hyMultilateralHighest')}</Typography>
                {multilateralCountyNames.length > 1 && <MultilateralRiskMoral riskData={riskData} results={results} />}
              </Div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} sx={{ paddingLeft: '15pt', borderBottom: 'none' }}>
              <RiskElement
                title={`${t('riskTable:countryRiskLevel')} (${highestRiskCountry.name})`}
                level={countryRisk?.level}
                infoText={countryInfoText}
                ekstra={ekstraText}
              />
            </TableCell>
          </TableRow>
        </>
      ) : (
        <TableRow>
          <TableCell colSpan={3} sx={{ paddingLeft: '15pt', borderBottom: 'none' }}>
            <RiskElement
              title={t('riskTable:countryRiskLevel')}
              level={countryRisk ? countryRisk.level : null}
              infoText={countryInfoText}
              ekstra={ekstraText}
            />
          </TableCell>
        </TableRow>
      )}
      {countryRisksWithTexts?.map((risk: Risk, id: number) => {
        if (risk.level && risk.level > 0) {
          return (
            <TableRow key={risk.id}>
              <TableCell colSpan={1} sx={{ paddingLeft: '35pt', borderBottom: 'none' }}>
                <RiskElement
                  level={risk.level}
                  title={risk.title}
                  infoText={risk.infoText}
                  style={{ paddingLeft: '10px' }}
                  childCell
                />
              </TableCell>
            </TableRow>
          )
        } else {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={id} style={{ display: 'none' }}>
              <TableCell colSpan={3} />
            </TableRow>
          )
        }
      })}
    </>
  )
}

export default CountryRiskElements
