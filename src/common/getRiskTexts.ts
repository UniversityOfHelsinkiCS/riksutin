import type { FormValues, Locales, Result, Risk } from '@types'

const getRiskTexts = (risks: Risk[], results: Result[], resultData: FormValues, language: string) => {
  if (!risks || !results || !resultData) {
    return null
  }

  const risksWithTexts: Risk[] = []

  risks.forEach(risk => {
    const text = results.find(r => r.optionLabel === `${risk.id}${risk.level}`)?.isSelected[language as keyof Locales]
    const updatedRisk: Risk = { infoText: text, ...risk }
    risksWithTexts.push(updatedRisk)
  })

  return risksWithTexts
}

export default getRiskTexts
