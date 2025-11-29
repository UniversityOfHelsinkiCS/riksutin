/* eslint-disable no-console */
import jsdom from 'jsdom'

import { get, setPermanent } from '../../util/redis'
import logger from 'src/server/util/logger'
import { UNIVERSITIES_URL, NO_CACHE, LOG_CACHE } from '@userconfig'

const getKey = countryName => `${UNIVERSITIES_URL}?country=${countryName}`

export const cacheUniversityData = async (countryName: string) => {
  if (countryName === 'United States') {
    countryName = 'United States of America'
  }

  const formdata = new FormData()

  formdata.append('Chp1', countryName)
  formdata.append('nbr_ref_pge', '10000')

  const response = await fetch(UNIVERSITIES_URL, {
    method: 'POST',
    body: formdata,
  })

  if (!response.ok) {
    return null
  }

  const key = getKey(countryName)
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

  try {
    const key = getKey(countryName)
    if (LOG_CACHE) {
      console.log('FROM CACHE ', key)
    }
    let names: string[] | null = await get(key)
    if (NO_CACHE || !names) {
      names = await cacheUniversityData(countryName)
    }

    return names
  } catch (error) {
    logger.error(error)
    return []
  }
}

export default getCountryUniversities
