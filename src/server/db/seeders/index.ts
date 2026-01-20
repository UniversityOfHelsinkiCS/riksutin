import logger from '../../util/logger'
import seedSurveys from './surveys'
import seedQuestions from './questions'
import seedResults from './results'
import seedUsers from './user'

const seed = async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1_000))

  try {
    await seedSurveys()
    seedQuestions()
    seedResults()
    await seedUsers()
    logger.info('Seeding successful')
    return true
  } catch (e) {
    logger.error('Seeding failed: ', e)
    return false
  }
}

export default seed
