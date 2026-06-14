import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'

import { sequelize } from '../connection'
import type { ControlReportTemplateLanguage, ControlReportTemplateRisk } from '@common/controlReportTemplate'

class ControlReportTemplate extends Model<
  InferAttributes<ControlReportTemplate>,
  InferCreationAttributes<ControlReportTemplate>
> {
  declare id: CreationOptional<string>

  declare name: string

  declare risks: ControlReportTemplateRisk[]

  declare language: ControlReportTemplateLanguage

  declare text: string

  declare createdAt: CreationOptional<Date>

  declare updatedAt: CreationOptional<Date>
}

ControlReportTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    risks: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
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
    tableName: 'control_report_templates',
  }
)

export default ControlReportTemplate
