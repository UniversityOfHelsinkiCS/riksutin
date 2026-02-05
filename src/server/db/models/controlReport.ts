import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'

import { sequelize } from '../connection'

class ControlReport extends Model<InferAttributes<ControlReport>, InferCreationAttributes<ControlReport>> {
  declare id: CreationOptional<string>

  declare entryId: number

  declare text: string

  declare createdBy: string

  declare createdAt: CreationOptional<Date>

  declare updatedAt: CreationOptional<Date>
}

ControlReport.init(
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
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'control_reports',
  }
)

export default ControlReport
