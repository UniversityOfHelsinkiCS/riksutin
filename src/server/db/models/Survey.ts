import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
} from 'sequelize'

import type { Locales } from '@types'

import { sequelize } from '../connection'
import Question from './Question'

class Survey extends Model<
  InferAttributes<Survey>,
  InferCreationAttributes<Survey>
> {
  declare id: CreationOptional<number>

  declare name: string

  declare title: Locales

  declare text: Locales

  declare Questions: NonAttribute<Question[]>
}

Survey.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    text: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    underscored: true,
    sequelize,
  }
)

export default Survey
