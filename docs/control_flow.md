```mermaid
sequenceDiagram
    participant entry
    participant riskData
    participant countryRisks
    participant countryRouter
    participant otherRisks
    participant totalRisk
    participant util

    entry->>riskData: getRiskData(data)
    activate riskData
    riskData ->>+ countryRisks: getMultilateralRisks(countries, formData)
    activate countryRisks
    Note right of countryRisks: for each country
    countryRisks ->> countryRouter: getCountryData(code)
    countryRisks ->> countryRisks: getCountryRisks(countryData, formData)
    deactivate countryRisks
    riskData ->> countryRouter: getCountryData(code)
    riskData ->> countryRisks: getCountryRisks(countryData, formData)
    riskData ->> otherRisks: getOtherRisks(updatedCountryData, questions, formData)
    riskData ->> totalRisk: getTotalRisk(otherRisks, updatedCountryData, formData)
    deactivate riskData
```
