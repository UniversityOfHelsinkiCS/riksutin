import {
  NewWarning,
  //git NewWarningZod,
} from '@validators/warning'

import { Warning } from '@dbmodels'
//import { DataTypes } from 'sequelize'

export const getWarnings = async (): Promise<Warning[]> => {
  const results = await Warning.findAll({})

  return results
}

export const getWarningWithId = async (id: number): Promise<Warning[]> => {
  //console.log("test1")

  const result = await Warning.findAll({
    where: {
      id,
    },
  })
  return result
}

export const createWarning = async (newWarningValues: NewWarning): Promise<Warning> => {
  //console.log("warn3")

  //const request = NewWarningZod.safeParse(newWarningValues)
  //console.log("warn4")

  const newWarning = await Warning.create({
    id: newWarningValues.id,
    country: newWarningValues.country,
    text: {
      fi: newWarningValues.text.fi,
      en: newWarningValues.text.en,
    },
    expiry_date: new Date(),
    //expiry_date: new Date('2025-12-31T23:59:59Z')
    //expiry_date: new Date(newWarningValues.expiry_date)
  })

  //console.log("warn5")
  return newWarning
}
