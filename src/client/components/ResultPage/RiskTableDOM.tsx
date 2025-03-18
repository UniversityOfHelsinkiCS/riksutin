import type { CountryData, RiskData } from '@types'

import useCountries from '../../hooks/useCountries'
import useResults from '../../hooks/useResults'
import RiskTable from '@resultRenderer/RiskTable'

const RiskTableDOM = ({ riskData, countryData }: { riskData: RiskData; countryData: CountryData }) => {
  const { results } = useResults(1)
  const { countries, isLoading } = useCountries()

  if (!riskData || !countries || isLoading || !results) return null

  return <RiskTable countries={countries} countryData={countryData} riskData={riskData} results={results} />
}

export default RiskTableDOM
