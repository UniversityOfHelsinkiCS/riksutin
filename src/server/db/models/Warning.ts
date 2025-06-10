import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from 'sequelize'

import { sequelize } from '../connection'
import type { Locales } from '@types'

class Warning extends Model<InferAttributes<Warning>, InferCreationAttributes<Warning>> {
  declare id: CreationOptional<number>
  declare country: string
  declare text: Locales
  declare expiry_date: Date
}

Warning.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
