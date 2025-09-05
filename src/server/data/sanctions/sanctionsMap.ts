/* eslint-disable no-console */
import { NO_CACHE, SANCTIONS_URL } from '@userconfig'
import { get, setPermanent } from '../../util/redis'

const url = SANCTIONS_URL

const fetchSanctionsData = async (code: string | undefined) => {
  if (!code) return null

  console.log('FROM CACHE', url)

  try {
    let data: any = await get(url)
    if (NO_CACHE || !data) {
      data = await cacheSanctionsData()
    }

    const countrySanctions = data.data.find(c => c.country.data.code === code)?.has_lists

    console.log('countrySanctions', countrySanctions)

    if (!countrySanctions) return null

    return countrySanctions
  } catch (error) {
    console.log('failed', error)
    return null
  }
}

export const cacheSanctionsData = async () => {
  try {
    console.log('caching: HTTP get', url)
    const res = await fetch(url)
    const data = await res.json()

    await setPermanent(url, data)
    return data
  } catch (error) {
    console.log('failed')
  }
}

export default fetchSanctionsData
