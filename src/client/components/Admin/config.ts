import type { InfoType } from '@types'
import type { Dimension } from '@frontend/types'

export const recommendationTypes: InfoType[] = [
  {
    id: 'common',
    title: {
      fi: 'Yleinen',
      sv: 'Yleinen',
      en: 'Common',
    },
  },
]

export const allSelection: Dimension = {
  id: 'allDimensions',
  label: 'allDimensions',
  color: '#000000',
  title: {
    fi: 'Kaikki',
    sv: 'All',
    en: 'All',
  },
  text: {
    fi: 'Kaikki',
    sv: 'All',
    en: 'All',
  },
}

export const languages: InfoType[] = [
  {
    id: 'en',
    title: {
      fi: 'englanti',
      sv: 'engelska',
      en: 'English',
    },
  },
  {
    id: 'sv',
    title: {
      fi: 'ruotsi',
      sv: 'svenska',
      en: 'Swedish',
    },
  },
]

export const questionTypes: InfoType[] = [
  {
    id: 'singleChoice',
    title: {
      fi: 'Yksittäis valinta',
      sv: 'Yksittäis valinta',
      en: 'Yksittäis valinta',
    },
  },
  {
    id: 'multipleChoice',
    title: {
      fi: 'Monivalinta',
      sv: 'Monivalinta',
      en: 'Monivalinta',
    },
  },
  {
    id: 'info',
    title: {
      fi: 'Infokenttä',
      sv: 'Infokenttä',
      en: 'Infokenttä',
    },
  },
]
