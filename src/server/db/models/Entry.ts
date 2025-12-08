import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'

import type { RiskData, TuhatData } from '@types'

import { sequelize } from '../connection'

class Entry extends Model<InferAttributes<Entry>, InferCreationAttributes<Entry>> {
  declare id: CreationOptional<number>

  declare surveyId: number

  declare userId: string

  declare ownerId: string

  declare data: RiskData

  declare tuhatData: TuhatData

  declare sessionToken: string

  declare reminderSent: CreationOptional<boolean>

  declare testVersion: boolean

  declare createdAt: CreationOptional<Date>

  declare updatedAt: CreationOptional<Date>
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
    tuhatData: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
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
    testVersion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize,
  }
)

export default Entry
