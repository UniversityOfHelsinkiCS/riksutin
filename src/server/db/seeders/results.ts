import { Result } from '@dbmodels'
import getResultData from '../../data/results'

const seedResults = () => {
  const results = getResultData()

  results.forEach(async result => {
    await Result.upsert({
      ...result,
    })
  })
}

export default seedResults
