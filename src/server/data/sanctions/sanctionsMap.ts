/* eslint-disable no-console */
import { LOG_CACHE, NO_CACHE, SANCTIONS_URL } from '@userconfig'
import { get, setPermanent } from '../../util/redis'

const url = SANCTIONS_URL

const fetchSanctionsData = async (code: string | undefined): Promise<number> => {
  if (!code) return 1

  if (LOG_CACHE) console.log('FROM CACHE', url)

  try {
    let data: any = await get(url)
    if (NO_CACHE || !data) {
      data = await cacheSanctionsData()
    }

    const countrySanctions = data.data.find(c => c.country.data.code === code)?.has_lists

    if (!countrySanctions) {
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
    if (LOG_CACHE) console.log('caching: HTTP get', url)
    const res = await fetch(url)
    const data = await res.json()

    await setPermanent(url, data)
    return data
  } catch (error) {
    console.log('failed')
  }
}

export default fetchSanctionsData
