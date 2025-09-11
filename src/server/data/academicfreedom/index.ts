import academicFreedom from './academic_freedom.json'

const getAcademicFreedom = code => {
  const country = academicFreedom.find(c => c.country_text_id === code)
  if (!country) {
    return null
  }

  const value = Number(country.v2xca_academ)

  if (value > 0.66) return 1
  if (value > 0.33) return 2

  return 3
}

export default getAcademicFreedom
