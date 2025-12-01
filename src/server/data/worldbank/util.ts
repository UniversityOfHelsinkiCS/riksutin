/* eslint-disable no-console */
import type { Indicator } from '@server/types'
import { getPermanent, setPermanent } from '../../util/redis'
import { cacheSafetyLevel } from '../safetyLevel'
import { cacheUniversityData } from '../whed/countryUniversities'
import { WORLDBANK_BASE_URL, NO_CACHE, LOG_CACHE, inProduction } from '@userconfig'
import * as Sentry from '@sentry/node'

const params = 'per_page=1000&format=json'

/* countries */

export const getCountryData = async () => {
  const url = `${WORLDBANK_BASE_URL}/countries?${params}`

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

  const data = await cacheCountryData()

  return data
}

export const cacheCountryData = async () => {
  const url = `${WORLDBANK_BASE_URL}/countries?${params}`

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

/* */

export const cacheIndicatorData = async (path: string) => {
  const url = `${WORLDBANK_BASE_URL}/${path}?${params}`

  if (LOG_CACHE) {
    console.log('HTTP REQUEST ', url)
  }

  try {
    const response = await fetch(url)
    const [_, data] = await response.json()

    const indicatorData = data.filter(({ value }) => value !== null)

    if (indicatorData.length === 0) {
      return null
    }

    const { value } = getLatestIndicator(indicatorData)

    await setPermanent(url, value)

    return value
  } catch (error) {
    console.log('failed caching: HTTP get', url, error)
    if (inProduction) {
      Sentry.captureException(error)
    }
    return null
  }
}

export const cacheCountryIndicator = async (countryCode: string, indicatorCode: string) => {
  const url = `country/${countryCode}/indicator/${indicatorCode}`
  return await cacheIndicatorData(url)
}

export const fetchIndicatorData = async (path: string) => {
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

  const data = await cacheIndicatorData(path)

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

export const buildPerCountryCache = async () => {
  console.log('caching country data: started')

  const countries = await getCountryData()
  const codes = countries.map(c => c.iso2Code)
  console.log('countries', codes.length)

  const failed: string[] = []

  for (const code of codes) {
    console.log(code)

    const safetyOk = await cacheSafetyLevel(code)
    if (safetyOk < 0) {
      failed.push(code)
    }

    const countryName = countries.find(c => c.iso2Code === code).name
    const univOk = await cacheUniversityData(countryName)
    if (!univOk) {
      failed.push(code)
    }

    const ccOk = await cacheCountryIndicator(code, 'CC.PER.RNK')
    if (!ccOk) {
      failed.push(code)
    }

    const pvOk = await cacheCountryIndicator(code, 'PV.PER.RNK')
    if (!pvOk) {
      failed.push(code)
    }

    await sleep(50)
  }

  console.log('failed:', failed)

  console.log('caching country data: done')
}
