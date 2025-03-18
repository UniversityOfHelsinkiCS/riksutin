import type { RiskData } from '@types'

import useSurvey from '../../hooks/useSurvey'
import useResultRefCallback from '../../hooks/useResultRefCallback'

import RiskTableDOM from './RiskTableDOM'
import MuiComponentProvider from '../Common/MuiComponentProvider'
import RenderAnswersDOM from './RenderAnswersDOM'
import { Box } from '@mui/material'

const RenderResults = ({ riskData }: { riskData: RiskData }) => {
  const { survey } = useSurvey()
  const refCallback = useResultRefCallback()

  if (!survey) return null

  return (
    <div ref={refCallback}>
      <MuiComponentProvider>
        <RiskTableDOM riskData={riskData} countryData={riskData.country[0]} />
        <Box sx={{ mt: 4 }} />
        <RenderAnswersDOM survey={survey} resultData={riskData.answers} />
      </MuiComponentProvider>
    </div>
  )
}

export default RenderResults
