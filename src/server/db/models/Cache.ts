import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'

import { sequelize } from '../connection'

class Cache extends Model<InferAttributes<Cache>, InferCreationAttributes<Cache>> {
  declare id: CreationOptional<number>

  declare key: string

  declare value: object
}

Cache.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    underscored: true,
    sequelize,
  }
)

export default Cache
