import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { FORM_DATA_KEY } from '@config'
import type { FormValues } from '@types'
import useLoggedInUser from '../hooks/useLoggedInUser'
import useUserFaculties from '../hooks/useUserFaculties'

import { extraOrganisations } from '@common/organisations'

interface ResultDataContextValue {
  resultData: FormValues
  setResultData: React.Dispatch<React.SetStateAction<FormValues>>
}

const LicenseResultDataContext = createContext<ResultDataContextValue | undefined>(undefined)

const ResultDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useLoggedInUser()
  const { userFaculties } = useUserFaculties()

  const getSavedInstance = useCallback(() => {
    const savedData = sessionStorage.getItem(FORM_DATA_KEY)

    const faculty = userFaculties && userFaculties.length > 0 ? userFaculties[0].code : extraOrganisations[0].code

    if (savedData) return JSON.parse(savedData)

    return {
      1: `${user?.firstName} ${user?.lastName}`,
      faculty,
    }
  }, [userFaculties, user])

  const savedFormData = getSavedInstance()

  const [resultData, setResultData] = useState<FormValues>(savedFormData)

  const contextValue = useMemo(() => ({ resultData, setResultData }), [resultData, setResultData])

  return <LicenseResultDataContext.Provider value={contextValue}>{children}</LicenseResultDataContext.Provider>
}

const useResultData = (): ResultDataContextValue => {
  const context = useContext(LicenseResultDataContext)
  if (!context) {
    throw new Error('useResultData must be used within a ResultDataProvider')
  }
  return context
}

export { ResultDataProvider, useResultData }
