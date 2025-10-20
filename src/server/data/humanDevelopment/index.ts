/* eslint-disable no-console */
import { get, setPermanent } from '../../util/redis'

import { HDI_URL, NO_CACHE } from '@userconfig'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const cacheHdrData = async () => {
  try {
    console.log('caching: HTTP get', HDI_URL)
    const res = await fetch(HDI_URL)
    const data = await res.json()

    await setPermanent(HDI_URL, data)
    return data
  } catch (error) {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getHumanDevelopmentApi = async (name: string | undefined, id: string | undefined) => {
  if (!name) {
    return null
  }

  let data: any = await get(HDI_URL)
  if (NO_CACHE || !data) {
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

const getHumanDevelopmentLocal = (name: string | undefined, id: string | undefined) => {
  console.log(name, id)

  try {
    const hdiFilePath = path.join(__dirname, 'hdi.json')
    const hdiData = JSON.parse(fs.readFileSync(hdiFilePath, 'utf8'))
    const countryData = hdiData.find(c => c.countryIsoCode === id)
    console.log(countryData)

    const recordIndex = Number(countryData.value)
    const level1 = 64
    const level2 = 128

    if (recordIndex <= level1) {
      return 1
    }
    if (recordIndex <= level2) {
      return 2
    }
    return 3
  } catch (error) {
    console.log('HDI error', error)
    return 3
  }
}

export default getHumanDevelopmentLocal
