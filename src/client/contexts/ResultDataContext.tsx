import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import type { FormValues } from '@types'

import { FORM_DATA_KEY } from '../../config'

interface ResultDataContextValue {
  resultData: FormValues
  setResultData: React.Dispatch<React.SetStateAction<FormValues>>
}

const LicenseResultDataContext = createContext<
  ResultDataContextValue | undefined
>(undefined)

const ResultDataProvider = ({ children }: { children: React.ReactNode }) => {
  const getSavedInstance = useCallback(() => {
    const savedData = sessionStorage.getItem(FORM_DATA_KEY)
    if (savedData) return JSON.parse(savedData)

    return {}
  }, [])

  const savedFormData = getSavedInstance()

  const [resultData, setResultData] = useState<FormValues>(savedFormData)

  const contextValue = useMemo(
    () => ({ resultData, setResultData }),
    [resultData, setResultData]
  )

  return (
    <LicenseResultDataContext.Provider value={contextValue}>
      {children}
    </LicenseResultDataContext.Provider>
  )
}

const useResultData = (): ResultDataContextValue => {
  const context = useContext(LicenseResultDataContext)
  if (!context) {
    throw new Error('useResultData must be used within a ResultDataProvider')
  }
  return context
}

export { ResultDataProvider, useResultData }
