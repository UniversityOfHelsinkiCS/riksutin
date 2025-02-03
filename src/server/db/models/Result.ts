import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize'

import type { Locales } from '@types'

import { sequelize } from '../connection'

class Result extends Model<
  InferAttributes<Result>,
  InferCreationAttributes<Result>
> {
  declare id: CreationOptional<number>

  declare surveyId: number

  declare optionLabel: string

  declare isSelected: Locales

  declare data: object
}

Result.init(
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
    optionLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSelected: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize,
  }
)

export default Result
