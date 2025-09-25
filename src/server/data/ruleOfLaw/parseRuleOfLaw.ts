import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'

const parseRuleOfLaw = (name: string | undefined) => {
  if (!name) {
    return null
  }

  const filePath = path.resolve(dirname(fileURLToPath(import.meta.url)), 'ruleOfLaw.csv')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const records = parse(fileContents, { delimiter: ',' })

  const countryRecord = records.find((record: string[]) => record[0].toUpperCase() === name.toUpperCase())

  if (!countryRecord) {
    return null
  }

  const score = Number(countryRecord[4])

  if (score < 0.45) {
    return 3
  }
  if (score < 0.7) {
    return 2
  }
  return 1
}

export default parseRuleOfLaw
