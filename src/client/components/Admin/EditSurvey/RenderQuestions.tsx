import { Box } from '@mui/material'

import type { Locales, Question } from '@types'

import QuestionItem from './QuestionItem'

interface RenderQuestionsProps {
  question: Question
  questions: Question[]
  language: keyof Locales
}

const RenderQuestions = ({ question, questions, language }: RenderQuestionsProps) => {
  if (!question || !questions) {
    return null
  }

  const childQuestions = questions.filter(childQuestion => question.id === childQuestion.parentId)

  return (
    <Box sx={{ ml: 4 }}>
      <QuestionItem question={question} questions={questions} language={language} />

      <>
        {childQuestions.map(children => (
          <RenderQuestions key={children.id} question={children} questions={questions} language={language} />
        ))}
      </>
    </Box>
  )
}

export default RenderQuestions
