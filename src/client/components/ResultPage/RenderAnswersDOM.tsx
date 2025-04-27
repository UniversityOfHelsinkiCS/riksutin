import { Survey } from '@client/types'
import useFaculties from '../../hooks/useFaculties'
import useUnits from '../../hooks/useUnits'
import RenderAnswers from '@resultRenderer/RenderAnswers'
import { FormValues } from '@types'

const RenderAnswersDOM = ({ survey, resultData }: { survey: Survey; resultData: FormValues }) => {
  const { faculties, isLoading: facultiesLoading } = useFaculties()
  const { faculties: units, isLoading: unitsLoading } = useUnits()

  if (facultiesLoading || !faculties) return null
  if (unitsLoading || !units) return null

  return <RenderAnswers survey={survey} resultData={resultData} faculties={faculties} units={units} />
}

export default RenderAnswersDOM
