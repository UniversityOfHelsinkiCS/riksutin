import type { Info, Indicator } from '@server/types'
import { fetchData, getLatestIndicator, riskLevelCheck } from './util'

type Response = [Info, Indicator[]]

const getCountryIndicator = async (countryCode: string, indicatorCode: string) => {
  const url = `country/${countryCode}/indicator/${indicatorCode}`

  const [_, data]: Response = await fetchData(url)

  const indicatorData = data.filter(({ value }) => value !== null)

  if (indicatorData.length === 0) {
    return null
  }

  const { value } = getLatestIndicator(indicatorData)

  if (value && indicatorCode === 'HD.HCI.OVRL') {
    return riskLevelCheck(0, 1, value)
  }

  return riskLevelCheck(0, 100, value)
}

export default getCountryIndicator
