import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'

import type { RiskData } from '@types'

import { sequelize } from '../connection'

class Entry extends Model<InferAttributes<Entry>, InferCreationAttributes<Entry>> {
  declare id: CreationOptional<number>

  declare surveyId: number

  declare userId: string

  declare ownerId: string

  declare data: RiskData

  declare sessionToken: string

  declare reminderSent: CreationOptional<boolean>
}

Entry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    surveyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    sessionToken: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    underscored: true,
    sequelize,
  }
)

export default Entry
