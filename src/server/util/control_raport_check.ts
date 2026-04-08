import { ENTRY_STATES } from '@common/entryStates'

import type { RiskData } from '@types'

export const control_raport_check = (data: RiskData): { state: string | undefined; parts: object } => {
  const totalRisk = (data as any)?.risks?.find((r: any) => r.id === 'total')?.level

  const total = totalRisk > 2

  return {
    state: total ? ENTRY_STATES.PENDING : undefined,
    parts: {
      total,
    },
  }
}
