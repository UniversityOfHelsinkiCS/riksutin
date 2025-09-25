/* eslint-disable no-console */
import { readFileSync } from 'fs'
import { writeFileSync } from 'fs'

const data = readFileSync('./V-Dem-CY-Core-v15.csv', 'utf-8').split('\n')
const header = data.shift().split(',')

const objects = []

const parse_line = rawLine => {
  const line = rawLine.split(',')

  //if (line[1] !== '"FIN"') return
  if (line[3] != 2024) {
    return
  }

  const object = {}

  for (let i = 0; i < header.length; i++) {
    const fields = ['v2xca_academ', 'country_name', 'country_text_id', 'year'].map(f => `"${f}"`)
    if (fields.includes(header[i])) {
      const key = header[i].replaceAll('"', '')
      const value = line[i].replaceAll('"', '')
      object[key] = value
    }
  }

  objects.push(object)
}

for (const rawLine of data) {
  parse_line(rawLine)
}

writeFileSync('./academic_freedom.json', JSON.stringify(objects, null, 2), 'utf-8')

console.log(objects)
