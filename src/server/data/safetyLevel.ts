/* eslint-disable no-console */
import Parser from 'rss-parser'
import jsdom from 'jsdom'
import { get, setPermanent } from '../util/redis'
import { LOG_CACHE, NO_CACHE, SAFETY_LEVEL_BASE_URL } from '@userconfig'

type SafetyLevel = [string, number]

const getUrl = code => `${SAFETY_LEVEL_BASE_URL}/o/rss?dctype=matkustustiedotteet&countrycode=${code}&lang=fi`

export const cacheSafetyLevel = async (code: string) => {
  const { JSDOM } = jsdom

  const parser = new Parser({
    customFields: {
      item: [['content:encoded', 'encoded']],
    },
  })

  const url = getUrl(code)

  console.log('HTTP REQUEST ', url)
  try {
    const feed = await parser.parseURL(url)

    const element = feed.items
    const dom = new JSDOM(element[0].encoded)
    const safetyLevel = dom.window.document.querySelector('p')?.textContent

    const safetyLevels: SafetyLevel[] = [
      ['Noudata tavanomaista varovaisuutta', 1],
      ['Noudata erityistä varovaisuutta', 2],
      ['Vältä tarpeetonta matkustamista', 2],
      ['Vältä kaikkea matkustamista', 3],
      ['Poistu välittömästi maasta', 3],
    ]

    const safetyLevelRisk = safetyLevels.find(level => level[0] === safetyLevel)?.[1] ?? null

    await setPermanent(url, safetyLevelRisk)
    return safetyLevelRisk
  } catch (e) {
    await setPermanent(url, 1)
    return 1
  }
}

const fetchSafetyLevelData = async (code: string) => {
  if (code === 'FI') {
    return null
  }

  const url = getUrl(code)

  if (LOG_CACHE) console.log('FROM CACHE', url)
  let safetyLevelRisk: any = await get(url)
  if (NO_CACHE || !safetyLevelRisk) {
    safetyLevelRisk = await cacheSafetyLevel(code)
  }

  return safetyLevelRisk
}

export default fetchSafetyLevelData
