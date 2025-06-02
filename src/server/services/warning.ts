import { Warning } from '@dbmodels'

export const getWarnings = async (): Promise<Warning[]> => {
  const results = await Warning.findAll({})

  return results
}
