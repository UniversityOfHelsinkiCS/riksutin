import React from 'react'

import RiskElement from './RiskElement'

const CountryRisks = ({ countryRisks }: { countryRisks: any }) => {
  if (!countryRisks) return null

  return (
    <>
      {countryRisks.map((risk: any) => (
        <RiskElement
          key={risk.id}
          level={risk.level}
          title={risk.title}
          infoText={risk.infoText}
          style={{ paddingLeft: '30px' }}
        />
      ))}
    </>
  )
}

export default CountryRisks
