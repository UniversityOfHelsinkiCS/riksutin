import type { FacultyOrUnit, Question } from '@types'
import type { Entry } from '@client/types'

export type TableValues = {
  [key: string]: string | undefined
}

const createTableData = (entries: Entry[], questions: Question[], faculties: FacultyOrUnit[]) => {
  const multiChoiceQuestions = questions
    .filter(question => {
      return question.optionData.type === 'multipleChoice' || question.optionData.type === 'highRiskCountrySelect'
    })
    .map(q => q.id)

  const singleChoiceQuestions = questions.filter(question => question.optionData.type === 'singleChoice').map(q => q.id)

  const questionIds = questions.map(q => q.id)

  const updatedEntries: TableValues[] = []

  entries.forEach(entry => {
    if (entry.data.answers.selectOrganisation) {
      entry.data.answers[22] = entry.data.answers.selectOrganisation
    }

    const formData = Object.fromEntries(
      questionIds.map(id => [
        id,
        entry.data.answers[id] && id === 2
          ? `${entry.data.answers[id].firstName} ${entry.data.answers[id].lastName} (${entry.data.answers[id].email})`
          : (entry.data.answers[id] ?? ''),
      ])
    )

    const formattedFormData: TableValues = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => {
        const idAsInt = parseInt(key, 10)

        if (singleChoiceQuestions.includes(idAsInt)) {
          const text = questions.find(q => q.id === idAsInt)?.optionData.options.find(o => o.id === val)?.title.fi
          return [key, text]
        }

        if (multiChoiceQuestions.includes(idAsInt) && Array.isArray(val)) {
          const texts = val.map(
            (value: string) =>
              questions
                .find(question => question.id === idAsInt)
                ?.optionData.options.find(option => option.id === value)?.title.fi
          )

          return [key, texts.join(', ') ?? '']
        }

        return [key, val]
      })
    )

    const additionalValues = {
      id: entry.id.toString(),
      date: `${new Date(entry.createdAt).toLocaleDateString()} ${new Date(entry.createdAt).toLocaleTimeString()}`,
      total: entry.data.risks.find(r => r.id === 'total')?.level.toString(),
    }

    const faculty = faculties.find(f => f.code === entry.data.answers.faculty)?.name.fi

    const unit = faculties.find(f => f.code === entry.data.answers.unit)
    const parsedUnit = unit ? `${unit.code} - ${unit.name.fi}` : entry.data.answers.unit

    const obj = { ...additionalValues, ...formattedFormData, faculty, unit: parsedUnit }

    updatedEntries.push(obj)
  })

  return updatedEntries
}

export default createTableData
