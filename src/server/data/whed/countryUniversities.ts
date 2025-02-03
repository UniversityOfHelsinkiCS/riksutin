import jsdom from 'jsdom'

import { set, get } from '../../util/redis'

const baseUrl = 'https://whed.net'

const fetchData = async (countryName: string) => {
  // eslint-disable-next-line no-param-reassign
  if (countryName === 'United States') countryName = 'United States of America'

  const url = `${baseUrl}/results_institutions.php`
  const key = `${url}?country=${countryName}`

  const cached = await get(key)
  if (cached) return cached

  const formdata = new FormData()

  formdata.append('Chp1', countryName)
  formdata.append('nbr_ref_pge', '10000')

  const response = await fetch(url, {
    method: 'POST',
    body: formdata,
  })

  const html = await response.text()

  await set(key, html)

  return html
}

const parseHTML = (html: string): string[] => {
  const { JSDOM } = jsdom
  const dom = new JSDOM(html)

  const universities = dom.window.document.querySelectorAll('h3')

  const filterList = ['Sort by:', 'Results per page:']

  const universityNames = [...universities]
    .map((university) => university?.textContent?.trim())
    .filter((name) => name && !filterList.includes(name))

  return universityNames
}

const getCountryUniversities = async (countryName: string | undefined) => {
  if (!countryName) return null

  try {
    const html = await fetchData(countryName)
    const universityNames = parseHTML(html)

    return universityNames
  } catch (error) {
    console.log(error)
    return []
  }
}

export default getCountryUniversities
