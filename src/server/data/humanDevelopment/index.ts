/* eslint-disable no-console */
import { get, setPermanent } from '../../util/redis'

import { HDR_API_TOKEN } from '@userconfig'

const year = 2023
const url = `https://hdrdata.org/api/CompositeIndices/query?apikey=${HDR_API_TOKEN}&year=${year}`

export const cacheHdrData = async () => {
  try {
    console.log('caching: HTTP get', url)
    const res = await fetch(url)
    const data = await res.json()

    await setPermanent(url, data)
    return data
  } catch (error) {
    return []
  }
}

const getHumanDevelopment = async (name: string | undefined, id: string | undefined) => {
  if (!name) return null

  let data: any = await get(url)
  if (!data) {
    data = await cacheHdrData()
  }

  const country = data.filter(d => d.country.slice(6) === name || d.country.slice(0, 3) === id)
  if (country.length === 0) {
    console.log('HDI not found', name)
    return 4
  }

  const hdi = country
    .filter(d => d.index === 'HDI - Human Development Index')
    .filter(d => d.indicator === 'hdi_rank - HDI Rank')
  if (hdi.length === 0) {
    console.log('HDI not found', name)
    return 4
  }

  const recordIndex = Number(hdi[0].value)

  const level1 = 64
  const level2 = 128

  if (recordIndex <= level1) {
    return 1
  }
  if (recordIndex <= level2) {
    return 2
  }
  return 3
}

export default getHumanDevelopment
