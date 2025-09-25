import useSurvey from './useSurvey'

const useFindQuestion = (searchParam: string) => {
  const { survey } = useSurvey()

  const foundByType = survey?.Questions.find(question => question.optionData.type === searchParam)

  const foundByFinnishTitle = survey?.Questions.find(question => question.title.fi === searchParam)

  if (!foundByType && !foundByFinnishTitle) {
    throw new Error('Question not found, check search params')
  }

  return foundByType ? foundByType.id : foundByFinnishTitle?.id
}

export default useFindQuestion
