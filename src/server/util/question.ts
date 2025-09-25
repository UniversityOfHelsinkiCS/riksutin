import { Question } from '@dbmodels'

export const nextAvailablePriority = async (parentId: number | null) => {
  let result = 1

  const priority: number = await Question.max('priority', {
    where: { parentId },
  })

  if (priority === null) {
    return 0
  }

  result += priority

  return result
}

export default nextAvailablePriority
