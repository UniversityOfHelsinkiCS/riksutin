import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize'

import { sequelize } from '../connection'
import type { Locales } from '@types'

class Warning extends Model<InferAttributes<Warning>, InferCreationAttributes<Warning>> {
  declare id: string
  declare country: string
  declare text: Locales
  declare expiry_date: Date
}

Warning.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
  },
  {
    underscored: true,
    sequelize,
  }
)

export default Warning
