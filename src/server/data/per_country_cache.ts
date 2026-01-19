/* eslint-disable no-console */
import { cacheSafetyLevel } from './safetyLevel'
import { cacheUniversityData } from './whed/countryUniversities'
import { getCountryData } from './worldbank/util'
import { getCountryIndicator } from './worldbank_api'

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const buildIndividualCountryCaches = async () => {
  console.log('Caching country data: started')

  const countries = await getCountryData()
  const codes = countries.map(c => c.iso2Code)
  console.log('No of countries', codes.length)

  const failed = {
    safety: [] as string[],
    university: [] as string[],
    corruption: [] as string[],
    violence: [] as string[],
  }

  for (const code of codes) {
    console.log(code)
    const country = countries.find(country => country.iso2Code === code)

    const safetyOk = await cacheSafetyLevel(code)
    if (safetyOk < 0) {
      failed.safety.push(code)
    }

    const univOk = await cacheUniversityData(country.name)
    if (!univOk) {
      failed.university.push(code)
    }

    const ccOk = await getCountryIndicator(country.id, 'WB_WDI_CC_PER_RNK')
    if (ccOk === undefined) {
      failed.corruption.push(code)
    }

    const pvOk = await getCountryIndicator(country.id, 'WB_WDI_PV_PER_RNK')
    if (pvOk === undefined) {
      failed.violence.push(code)
    }

    await sleep(100)
  }

  console.log('failed:', failed)

  console.log('caching country data: done')
  return failed
}
