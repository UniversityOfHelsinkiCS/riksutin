import { Survey } from '@client/types'
import useFaculties from '../../hooks/useFaculties'
import RenderAnswers from '@resultRenderer/RenderAnswers'
import { FormValues } from '@types'

const RenderAnswersDOM = ({ survey, resultData }: { survey: Survey; resultData: FormValues }) => {
  const { faculties, isLoading: facultiesLoading } = useFaculties()

  if (facultiesLoading || !faculties) return null

  return <RenderAnswers survey={survey} resultData={resultData} faculties={faculties} />
}

export default RenderAnswersDOM
