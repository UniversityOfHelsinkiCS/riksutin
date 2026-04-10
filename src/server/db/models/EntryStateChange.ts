import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'

import { sequelize } from '../connection'

class EntryStateChange extends Model<InferAttributes<EntryStateChange>, InferCreationAttributes<EntryStateChange>> {
  declare id: CreationOptional<string>

  declare entryId: number

  declare fromState: CreationOptional<string | null>

  declare toState: string

  declare changedBy: string

  declare createdAt: CreationOptional<Date>
}

EntryStateChange.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    entryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'entries',
        key: 'id',
      },
    },
    fromState: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    toState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize,
    tableName: 'entry_state_changes',
    updatedAt: false,
  }
)

export default EntryStateChange
