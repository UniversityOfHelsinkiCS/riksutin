import Parser from 'rss-parser'
import jsdom from 'jsdom'

type SafetyLevel = [string, number]

const fetchSafetyLevelData = async (code: string) => {
  const { JSDOM } = jsdom

  const parser = new Parser({
    customFields: {
      item: [['content:encoded', 'encoded']],
    },
  })
  const url = `https://um.fi/o/rss?dctype=matkustustiedotteet&countrycode=${code}&lang=fi`

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

    const safetyLevelRisk =
      safetyLevels.find((level) => level[0] === safetyLevel)?.[1] || null

    return safetyLevelRisk
  } catch (error) {
    return null
  }
}

export default fetchSafetyLevelData
