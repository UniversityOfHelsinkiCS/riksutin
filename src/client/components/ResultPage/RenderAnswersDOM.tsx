import { Survey } from '@client/types'
import useFaculties from '../../hooks/useFaculties'
import useUnits from '../../hooks/useUnits'
import RenderAnswers from '@resultRenderer/RenderAnswers'
import { FormValues } from '@types'

const RenderAnswersDOM = ({
  survey,
  resultData,
  changedFields,
}: {
  survey: Survey
  resultData: FormValues
  changedFields?: Set<number>
}) => {
  const { faculties, isLoading: facultiesLoading } = useFaculties()
  const { faculties: units, isLoading: unitsLoading } = useUnits()

  if (facultiesLoading || !faculties) {
    return null
  }
  if (unitsLoading || !units) {
    return null
  }

  return (
    <RenderAnswers
      survey={survey}
      resultData={resultData}
      faculties={faculties}
      units={units}
      changedFields={changedFields}
    />
  )
}

export default RenderAnswersDOM
