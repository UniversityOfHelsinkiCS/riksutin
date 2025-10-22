/* eslint-disable no-console */
import { LOG_CACHE, NO_CACHE, SANCTIONS_URL } from '@userconfig'
import { get, setPermanent } from '../../util/redis'

const url = SANCTIONS_URL

const fetchSanctionsData = async (code: string | undefined): Promise<number> => {
  if (!code) {
    return 1
  }

  if (LOG_CACHE) {
    console.log('FROM CACHE', url)
  }

  try {
    let data: any = await get(url)
    if (NO_CACHE || !data) {
      data = await cacheSanctionsData()
    }

    const countrySanctions = data.filter(c => c.country_code === code && c.has_lists)

    if (countrySanctions.length === 0) {
      return 1
    }

    return 3
  } catch (error) {
    console.log('failed', error)
    return 1
  }
}

export const cacheSanctionsData = async () => {
  try {
    if (LOG_CACHE) {
      console.log('caching: HTTP get', url)
    }
    const res = await fetch(url)
    const parsed = await res.json()
    const data = parsed.data.map(o => ({ country_code: o.country.data.code, has_lists: o.has_lists }))

    if (res.status !== 200) {
      throw new Error('non 200 response')
    }

    const sanctionedCountries = ['AF', 'BY', 'CN']

    if (data.length > 0 && data.some(item => sanctionedCountries.includes(item.country_code))) {
      await setPermanent(url, data)
    } else {
      throw new Error('suspicious data')
    }

    return data
  } catch (error) {
    console.log('failed caching: HTTP get', url)
  }
}

export default fetchSanctionsData
