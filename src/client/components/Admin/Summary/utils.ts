import type { Faculty, Question } from '@types'
import type { Entry } from '@frontend/types'

export type TableValues = {
  [key: string]: string
}

const createTableData = (
  entries: Entry[],
  questions: Question[],
  faculties: Faculty[]
) => {
  const multiChoiceQuestions = questions
    .filter(
      (question) =>
        question.optionData.type ===
        ('multipleChoice' || 'highRiskCountrySelect')
    )
    .map((q) => q.id)

  const singleChoiceQuestions = questions
    .filter((question) => question.optionData.type === 'singleChoice')
    .map((q) => q.id)

  const questionIds = questions.map((q) => q.id)

  const updatedEntries: TableValues[] = []

  entries.forEach((entry) => {
    if (entry.data.answers.selectOrganisation) {
      // eslint-disable-next-line no-param-reassign
      entry.data.answers[22] = entry.data.answers.selectOrganisation
    }

    const formData = Object.fromEntries(
      questionIds.map((id) => [id, entry.data.answers[id] ?? ''])
    )

    const formattedFormData: TableValues = Object.fromEntries(
      Object.entries(formData).map((pair) => {
        const idAsInt = parseInt(pair[0], 10)

        if (singleChoiceQuestions.includes(idAsInt)) {
          const text: string = questions
            .find((q) => q.id === idAsInt)
            ?.optionData.options.find((o: { id: any }) => o.id === pair[1])
            ?.title.fi
          return [pair[0], text]
        }

        if (multiChoiceQuestions.includes(idAsInt) && Array.isArray(pair[1])) {
          const texts = pair[1].map(
            (value: string) =>
              questions
                .find((question) => question.id === idAsInt)
                ?.optionData.options.find((option) => option.id === value)
                ?.title.fi
          )

          return [pair[0], texts.join(', ') ?? '']
        }
        return pair as [string, string]
      })
    )

    const additionalValues = {
      id: entry.id.toString(),
      date: `${new Date(entry.createdAt).toLocaleDateString()} ${new Date(
        entry.createdAt
      ).toLocaleTimeString()}`,
      total: entry.data.risks.find((r) => r.id === 'total')?.level.toString(),
    }

    const faculty = faculties.find((f) => f.code === entry.data.answers.faculty)
      ?.name.fi

    const obj = { ...additionalValues, ...formattedFormData, faculty }

    updatedEntries.push(obj)
  })

  return updatedEntries
}

export default createTableData
