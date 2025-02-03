import type { Locales, Question } from '@types'

const sortQuestions = (questions: Question[], language: keyof Locales) => {
  const sortedQuestions = questions.sort((a, b) => {
    if (a.title[language] > b.title[language]) return 1
    if (a.title[language] < b.title[language]) return -1

    return 0
  })

  return sortedQuestions
}

export default sortQuestions
