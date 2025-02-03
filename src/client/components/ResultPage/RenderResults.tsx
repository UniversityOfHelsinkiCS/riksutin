import React from 'react'
import { Box } from '@mui/material'

import type { RiskData } from '@types'

import useSurvey from '../../hooks/useSurvey'
import useResultRefCallback from '../../hooks/useResultRefCallback'

import RiskTable from './RiskTable'

import RenderAnswers from './RenderAnswers'

const RenderResults = ({ riskData }: { riskData: RiskData }) => {
  const { survey } = useSurvey()
  const refCallback = useResultRefCallback()

  if (!survey) return null

  return (
    <Box ref={refCallback}>
      <RiskTable riskData={riskData} countryData={riskData.country[0]} />
      <RenderAnswers survey={survey} resultData={riskData.answers} />
    </Box>
  )
}

export default RenderResults
