export const ENTRY_STATES = {
  PENDING: 'PENDING',
  EXPERT_GROUP: 'EXPERT_GROUP',
  APPROVED: 'APPROVED',
  BLOCKED: 'BLOCKED',
  MANAGEMENT_GROUP: 'MANAGEMENT_GROUP',
} as const

export type EntryState = (typeof ENTRY_STATES)[keyof typeof ENTRY_STATES]

export const ENTRY_STATE_LABELS: Record<EntryState, string> = {
  [ENTRY_STATES.PENDING]: 'Edellyttää asiantuntijaryhmän käsittelyä',
  [ENTRY_STATES.EXPERT_GROUP]: 'Otettu asiantuntijaryhmän käsittelyyn',
  [ENTRY_STATES.APPROVED]: 'Asia käsitelty, hanke voi edetä käsittelytoimenpiteissä yksilöidyllä tavalla',
  [ENTRY_STATES.BLOCKED]: 'Asia käsitelty, eteneminen estetty',
  [ENTRY_STATES.MANAGEMENT_GROUP]: 'Asia nostettu johtoryhmän käsittelyyn',
}

export const getEntryStateColor = (state: string): 'error' | 'success' | 'warning' | 'info' | 'default' => {
  if (state === ENTRY_STATES.BLOCKED) {
    return 'error'
  }
  if (state === ENTRY_STATES.APPROVED) {
    return 'success'
  }
  if (state === ENTRY_STATES.PENDING) {
    return 'warning'
  }
  return 'warning'
}

export const getEntryStateLabel = (state: string): string => ENTRY_STATE_LABELS[state as EntryState] ?? state
