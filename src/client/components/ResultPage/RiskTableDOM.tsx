import type { CountryData, RiskData } from '@types'

import useCountries from '../../hooks/useCountries'
import useResults from '../../hooks/useResults'
import RiskTable from '@resultRenderer/RiskTable'
import { useWarnings } from '../../../client/hooks/useWarnings'

const RiskTableDOM = ({ riskData, countryData }: { riskData: RiskData; countryData: CountryData }) => {
  const { results } = useResults(1)
  const { countries, isLoading } = useCountries()
  const { warnings } = useWarnings()

  if (!riskData || !countries || isLoading || !results || !warnings) return null

  return (
    <RiskTable
      countries={countries}
      countryData={countryData}
      riskData={riskData}
      results={results}
      warnings={warnings}
    />
  )
}

export default RiskTableDOM
