```mermaid
sequenceDiagram
    participant entryRouter
    participant riskData
    participant countryRisks
    participant countryRouter
    participant otherRisks
    participant totalRisk
    participant util

    entryRouter->>riskData: getRiskData(data)
    activate riskData
    riskData ->>+ countryRisks: getMultilateralRisks(countries, formData)
    activate countryRisks
    Note right of countryRisks: for each country
    countryRisks ->> countryRouter: getCountryData(code)
    countryRisks ->> countryRisks: getCountryRisks(countryData, formData)
    countryRisks ->> util: totalCountryRisk(updatedCountryData)
    deactivate countryRisks
    riskData ->> countryRouter: getCountryData(code)
    riskData ->> countryRisks: getCountryRisks(countryData, formData)
    activate countryRisks
    countryRisks ->> util: gdprRisk(countryData, formData
    deactivate countryRisks
    riskData ->> otherRisks: getOtherRisks(updatedCountryData, questions, formData)
    activate otherRisks
    otherRisks ->> util: totalCountryRisk(countryData)
    otherRisks ->> util: dualUseRisk(country, formData)
    otherRisks ->> util: organisationRisk(formData)
    deactivate otherRisks
    riskData ->> totalRisk: getTotalRisk(otherRisks, updatedCountryData, formData)
    activate totalRisk
    totalRisk ->> util: totalCountryRisk(countryData)
    deactivate totalRisk
    riskData -->> entryRouter: resultJson
    deactivate riskData
```
