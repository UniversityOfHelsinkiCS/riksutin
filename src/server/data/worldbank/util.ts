/* eslint-disable no-console */
import type { Indicator } from '@server/types'
import { set, get, setPermanent } from '../../util/redis'

const baseUrl = 'https://api.worldbank.org/v2'

const params = 'per_page=1000&format=json'

export const cacheData = async (path: string) => {
  const url = `${baseUrl}/${path}?${params}`

  console.log('HTTP REQUEST ', url)

  const response = await fetch(url)
  const data = await response.json()

  await setPermanent(url, data)

  return data
}

export const cacheCountryIndicator = async (countryCode: string, indicatorCode: string) => {
  const url = `country/${countryCode}/indicator/${indicatorCode}`

  await cacheData(url)
}

export const fetchData = async (path: string) => {
  const url = `${baseUrl}/${path}?${params}`

  const cached = await get(url)
  if (cached) {
    console.log('fetch CACHED', url)
    return cached
  }

  console.log('fetch HTTP REQUEST ', url)

  const response = await fetch(url)
  const data = await response.json()

  await set(url, data)

  return data
}

export const getLatestIndicator = (indicators: Indicator[]) => {
  indicators.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return indicators[0]
}

export const riskLevelCheck = (start: number, end: number, res: number | undefined) => {
  if (!res) {
    return null
  }
  const riskLevel = [3, 2, 1]
  const distance = Math.abs(start - end)
  const intervalCounter = distance / 3

  let startOfInterval = start
  let endOfInterval = start + intervalCounter
  for (let step = 0; step < 3; step += 1) {
    if (res > startOfInterval && res < endOfInterval) {
      return riskLevel[step]
    }
    startOfInterval = start + intervalCounter
    endOfInterval += intervalCounter
  }
  return null
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const buildCache = async () => {
  console.log('caching country data: started')
  await cacheData('countries')

  const countriesUrl = `${baseUrl}/countries?${params}`
  const [_, data] = await get(countriesUrl)
  const countries = data.filter(({ region }) => region.value !== 'Aggregates')
  console.log('contries', countries.length)
  const codes = countries.map(c => c.iso2Code)

  //for (const code of codes) {
  for (const code of [codes[0]]) {
    console.log(code)
    try {
      await cacheCountryIndicator(code, 'CC.PER.RNK')
      await cacheCountryIndicator(code, 'PV.PER.RNK')
    } catch (e) {
      console.log('FAILED ', code)
    }

    await sleep(100)
  }

  console.log('caching country data: done')
}
