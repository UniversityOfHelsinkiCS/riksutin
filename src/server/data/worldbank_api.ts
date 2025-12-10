/* eslint-disable no-console */
import { inProduction, LOG_CACHE, NO_CACHE, WORLDBANK_360_BASE_URL, WORLDBANK_YEAR } from '@userconfig'
import { getPermanent, setPermanent } from '../util/redis'
import * as Sentry from '@sentry/node'

const riskLevelCheck = (start: number, end: number, res: number | undefined) => {
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

export const cacheIndicatorData = async (url: string) => {
  if (LOG_CACHE) {
    console.log('HTTP REQUEST ', url)
  }

  const response = await fetch(url)
  if (!response.ok) {
    console.log('failed caching: HTTP get', url, response.status)
    if (inProduction) {
      Sentry.captureException('failed caching: HTTP get ' + url + ' ' + response.status)
    }
    return undefined
  }

  const data = await response.json()
  if (data.count < 1) {
    return null
  }

  const value = Number(data.value[0].OBS_VALUE)

  await setPermanent(url, value)

  return value
}

export const fetchIndicatorData = async (path: string) => {
  const url = `${WORLDBANK_360_BASE_URL}/${path}`

  const cached = await getPermanent(url)

  if (!NO_CACHE && cached) {
    if (LOG_CACHE) {
      console.log('FROM CACHE', url)
    }
    return Number(cached)
  }

  const value = await cacheIndicatorData(url)

  return value
}

export const getCountryIndicator = async (countryCode: string, indicatorCode: string) => {
  const path = `data?DATABASE_ID=WB_WDI&INDICATOR=${indicatorCode}&REF_AREA=${countryCode}&TIME_PERIOD=${WORLDBANK_YEAR}&UNIT_MEASURE=RANK&skip=0`

  const value = await fetchIndicatorData(path)

  if (!value) {
    return null
  }

  return riskLevelCheck(0, 100, value)
}
