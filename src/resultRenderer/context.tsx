import React from 'react'
import { TFunction } from 'i18next'

type Component = React.ComponentType<any>
type Components = {
  Div: Component
  Markdown: Component
  Table: Component
  TableContainer: Component
  Typography: Component
  TableRow: Component
  TableCell: Component
  TableBody: Component
  t: TFunction
  language: string
}

const ComponentContext = React.createContext<Components>({} as Components)
export const useComponents = () => React.useContext(ComponentContext)
export const ComponentProvider = ({ components, children }: { components: Components; children: React.ReactNode }) => {
  return <ComponentContext.Provider value={components}>{children}</ComponentContext.Provider>
}
