/* eslint-disable no-console */
import jsdom from 'jsdom'

import * as Sentry from '@sentry/node'
import { get, setPermanent } from '../../util/redis'
import logger from 'src/server/util/logger'
import { UNIVERSITIES_URL, NO_CACHE, LOG_CACHE } from '@userconfig'

const normalizeCountryName = (countryName: string) => {
  if (countryName === 'United States') {
    return 'United States of America'
  }

  if (countryName === 'Hong Kong SAR, China') {
    return 'China - Hong Kong SAR'
  }

  if (countryName === 'Macao SAR, China') {
    return 'China - Macao SAR'
  }

  if (countryName === 'Taiwan') {
    return 'China - Taiwan'
  }

  return countryName
}

const getKey = countryName => `${UNIVERSITIES_URL}?country=${countryName}`

export const cacheUniversityData = async (countryName: string) => {
  const formdata = new FormData()

  formdata.append('Chp1', countryName)
  formdata.append('nbr_ref_pge', '10000')

  const response = await fetch(UNIVERSITIES_URL, {
    method: 'POST',
    body: formdata,
  })

  const key = getKey(countryName)

  if (!response.ok) {
    console.log('HTTP POST FAIL ', key)
    Sentry.captureException('HTTP POST FAIL ' + key)
    return null
  }

  if (LOG_CACHE) {
    console.log('HTTP POST REQUEST ', key)
  }

  const html = await response.text()

  const universityNames: string[] = parseHTML(html)

  await setPermanent(key, universityNames)

  return universityNames
}

const parseHTML = (html: string): string[] => {
  const { JSDOM } = jsdom
  const dom = new JSDOM(html)

  const filterList = ['Sort by:', 'Results per page:']
  const universities = dom.window.document.querySelectorAll('h3')

  const universityNames = [...universities]
    .map(university => university?.textContent?.trim())
    .filter(name => !!name) as string[]

  const filteredUniversityNames = universityNames.filter(name => !filterList.includes(name))

  return filteredUniversityNames
}

const getCountryUniversities = async (countryName: string | undefined) => {
  if (!countryName) {
    return null
  }

  const normalizedCountryName = normalizeCountryName(countryName)

  try {
    const key = getKey(normalizedCountryName)
    if (LOG_CACHE) {
      console.log('FROM CACHE ', key)
    }
    let names: string[] | null = await get(key)
    if (NO_CACHE || !names) {
      names = await cacheUniversityData(normalizedCountryName)
    }

    return names
  } catch (error) {
    logger.error(error)
    return []
  }
}

export default getCountryUniversities
