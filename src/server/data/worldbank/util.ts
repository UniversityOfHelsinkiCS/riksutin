/* eslint-disable no-console */
import type { Indicator } from '@server/types'
import { get, getPermanent, setPermanent } from '../../util/redis'
import { cacheSafetyLevel } from '../safetyLevel'
import { cacheUniversityData } from '../whed/countryUniversities'
import { WORLDBANK_BASE_URL, NO_CACHE, LOG_CACHE, inProduction } from '@userconfig'
import * as Sentry from '@sentry/node'

const params = 'per_page=1000&format=json'

export const cacheData = async (path: string) => {
  const url = `${WORLDBANK_BASE_URL}/${path}?${params}`

  if (LOG_CACHE) {
    console.log('HTTP REQUEST ', url)
  }

  try {
    const response = await fetch(url)
    const [_, data] = await response.json()

    const countries = data
      .filter(({ region }) => region.value !== 'Aggregates')
      .map(c => ({ id: c.id, name: c.name, iso2Code: c.iso2Code }))
    await setPermanent(url, countries)

    return countries
  } catch (error) {
    console.log('failed caching: HTTP get', url, error)
    if (inProduction) {
      Sentry.captureException(error)
    }
    return []
  }
}

export const cacheCountryIndicator = async (countryCode: string, indicatorCode: string) => {
  const url = `country/${countryCode}/indicator/${indicatorCode}`

  await cacheData(url)
}

export const fetchData = async (path: string) => {
  const url = `${WORLDBANK_BASE_URL}/${path}?${params}`

  const cached = await getPermanent(url)

  if (!NO_CACHE && cached) {
    if (LOG_CACHE) {
      console.log('FROM CACHE', url)
    }
    return cached
  }

  if (LOG_CACHE) {
    console.log('fetch HTTP REQUEST ', url)
  }

  const data = await buildCountryCache()

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

export const buildCountryCache = async () => {
  console.log('caching countryies')
  const result = await cacheData('countries')
  return result
}

export const buildCache = async () => {
  console.log('caching country data: started')
  await cacheData('countries')

  const countriesUrl = `${WORLDBANK_BASE_URL}/countries?${params}`
  const [_, data]: any = await get(countriesUrl)
  const countries = data.filter(({ region }) => region.value !== 'Aggregates')
  const codes = countries.map(c => c.iso2Code)
  console.log('countries', codes.length)

  const failed: string[] = []

  for (const code of codes) {
    console.log(code)
    try {
      await cacheSafetyLevel(code)
    } catch (e) {
      failed.push(code)
    }
    try {
      const countryName = countries.find(c => c.iso2Code === code).name
      await cacheUniversityData(countryName)
    } catch (e) {
      failed.push(code)
    }
    try {
      await cacheCountryIndicator(code, 'CC.PER.RNK')
      await cacheCountryIndicator(code, 'PV.PER.RNK')
    } catch (e) {
      failed.push(code)
    }

    await sleep(50)
  }

  console.log('failed:', failed)

  console.log('caching country data: done')
}
