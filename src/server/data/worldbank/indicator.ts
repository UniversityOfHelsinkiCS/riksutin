import { fetchIndicatorData, riskLevelCheck } from './util'

const getCountryIndicator = async (countryCode: string, indicatorCode: string) => {
  const url = `country/${countryCode}/indicator/${indicatorCode}`

  const value = await fetchIndicatorData(url)

  if (!value || value == 0) {
    return null
  }

  if (value && indicatorCode === 'HD.HCI.OVRL') {
    return riskLevelCheck(0, 1, value as number)
  }

  return riskLevelCheck(0, 100, value as number)
}

export default getCountryIndicator
