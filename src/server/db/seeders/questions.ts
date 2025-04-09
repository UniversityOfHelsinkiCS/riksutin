import { Question } from '@dbmodels'
import getQuestionData from '../../data/questions'

const seedQuestions = () => {
  const questions = getQuestionData()

  questions.forEach(async question => {
    await Question.upsert({
      ...question,
    })
  })
}

export default seedQuestions
