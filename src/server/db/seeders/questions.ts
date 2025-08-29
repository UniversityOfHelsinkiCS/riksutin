import { Question } from '@dbmodels'
import getQuestionData from '../../data/questions'

const seedQuestions = () => {
  const questions = getQuestionData()

  questions.forEach(async question => {
    return await Question.upsert({
      ...question,
      shortTitle: question.shortTitle ?? { fi: '', en: '', sv: '' },
    })
  })
}

export default seedQuestions
