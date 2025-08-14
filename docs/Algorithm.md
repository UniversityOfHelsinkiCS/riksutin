# Algorithm documentation

This app contains an algorithm that calculates different risks for the project based on the answers user has provided in the survey. The algorithm is located in the backend at `util/algorithm`. In general, the algorithm receives a `FormValues` object and returns a `RiskData` object which is appended to the entry that is saved to the database.

## RiskData

`RiskData` object is one of the most important components of the app because it contains information of the risks related to the project. The object consists of the following properties.

### Answers

`Answers` contains all the data collected in the survey. It is a `FormValues` object.

### Country

`Country` includes all the country risks. These risks are based on the country the user has selected. It is a simple key-value object where the key is a title of the risk and value is either a risk level (a number from 1 to 3) or some other value if it requires information from the survey before it can be converted to a risk level.

The object includes the following data. The source for data is in the brackets:

- Academic freedom ([CSV](../src/server/data/academicfreedom/academicfreedom.csv)), year used ??
  - source https://v-dem.net/data/the-v-dem-dataset/
  - Se on ainakin mukana tossa Country-Year: V-Dem Full+Others -datasetissä ja sitä merkitään koodilla v2xca_academ
- Corruption ([Worldbank API](https://api.worldbank.org/v2))
- Human development index ([CSV](../src/server/data/humanDevelopment/humanDevelopment.csv)) source [https://hdr.undp.org/] current data 2023
  - see https://github.com/UniversityOfHelsinkiCS/riksutin/blob/master/src/server/data/humanDevelopment/index.ts#L6
  - for data, see
     - https://hdr.undp.org/data-center/human-development-index#/indicies/HDI
     - https://hdrdata.org/api/CompositeIndices/query?apikey=KEY_HERE&year=2023
     - https://hdr.undp.org/sites/default/files/2023-24_HDR/HDRO_data_api_manual.pdf
- Political stability ([Worldbank API](https://api.worldbank.org/v2))
- Safety level ([Ministry for Foreign Affairs of Finland's matkustustiedotteet](https://um.fi/o/rss?dctype=matkustustiedotteet), RSS feed)
- Sanctions ([EU sanctions map API](https://sanctionsmap.eu/api/v1/regime))
- Rule of Law ([CSV](../src/server/data/ruleOfLaw/ruleOfLaw.csv)) https://worldjusticeproject.org/, current data 2023
  - go to https://worldjusticeproject.org/rule-of-law-index/global/2024/table open network tab, there is 2024.csv and other years 
- Universities ([WHED](https://whed.net/results_institutions.php), scraper)

(see also https://github.com/UniversityOfHelsinkiCS/riksutin/blob/master/docs/DataSources.md)

Risk levels of sanctions, safety level and universities are calculated based on the form data.

### Risks

`Risks` property is an array of `Risk` objects that are not included in `CountryData`. `Risk` object looks like this

```typescript
export interface Risk {
  id: string // unique id
  title: string // title for the risk that is rendered in the risk table
  level: any // risk level which can be a number from 1 to 3 or a falsy value
  infoText?: string // info text tells more information about the risk level and if the level requires some additional actions. The text is appended to the risk object in the client-side.
}
```

### UpdatedData

The app can recalculate the risks. This action is triggered in two occasions:

1. The user presses a button in the user page
2. A cron job recalculates them once a week

The recalculated data is saved to `UpdatedData`. It is an array of objects, and one object contains the same properties as `RiskData` and additionally `createdAt` string.

## Structure

The algorithm consists of the following files:

### createRiskData.ts

**What does it do**

This file is the main file of the algorithm. It contains one function - `createRiskData` - that is responsible for collecting all the risks together and returning the ready `RiskData` object to `entryRouter`.

In addition, this function gets all the country risks.

**Props**

`createRiskData` accepts an object with type `FormValues` as props.

---

### getCountryRisks.ts

**What does it do**

This file contains a function `getCountryRisks`. It updates `sanctions`, `gdpr` and `safetyLevel` risks so that they have numeric values.

**Props**

`getCountryRisks` has two parameters: `countryData: CountryData` and `formData: FormValues`

---

### getOtherRisks.ts

**What does it do**

The file contains a `getOtherRisks` function that creates a `Risk[]` object which looks like this:

```typescript
const riskArray: Risk[] = [
  {
    id: 'country',
    title: 'riskTable:countryRiskLevel',
    level: countryRiskValues ? countryRiskValues[0] : null,
  },
  {
    id: 'university',
    title: 'riskTable:universityRiskLevel',
    level: universityRisk(formData['20'], country?.universities),
  },
  {
    id: 'duration',
    title: 'riskTable:durationRiskLevel',
    level: questions
      .find((question) => question.id === 12)
      ?.optionData.options.find((o) => o.id === formData[12])?.risk,
  },
  {
    id: 'dualUse',
    title: 'riskTable:dualUseRiskLevel',
    level: dualUseRiskValue,
  },
  {
    id: 'organisation',
    title: 'riskTable:organisationRiskLevel',
    level: organisationRiskValue,
  },
  {
    id: 'economic',
    title: 'riskTable:economicRiskLevel',
    level: questions
      .find((question) => question.id === 16)
      ?.optionData.options.find((o) => o.id === formData[16])?.risk,
  },
  {
    id: 'ethical',
    title: 'riskTable:ethicalRiskLevel',
    level: ethicalRiskValue,
  },
]
```

Consortium risk is added to the array if necessary.

Finally all risks that have null or undefined risk level are filtered out.

**Props**

`getOtherRisks(country: UpdatedCountryData, questions: Question[], formData: FormValues)`

---

### getTotalRisk.ts

**What does it do**

This file contains a function `getTotalRisk` which calculates a total risk level for the projects based on all the individual risks.

The level is calculated by calculating an average level of all risks and rounding it to the nearest integer. After that, the level is multiplied with a few multiplier and if the level happens to be over 3, it is set to 3.

**Props**

`getTotalRisk(riskArray: Risk[], country: UpdatedCountryData | undefined, formData: FormValues)`

---

### countryLists.ts

This file contains static lists of country codes used in the algorithm. There are four lists: `euCountries`, `eeaCountries`, `adequateProtectionCountries` and `globalNorthCountries`

---

### utils.ts

`utils.ts` contains a few different utility functions that are used to calculate specific risks. The file contains functions for:

- GDPR
- University
- Dual Use
- Organisation
- Consortium
- Total country risk
