import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('control_report_templates', {
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  })

  await queryInterface.addIndex('control_report_templates', ['risks'], {
    using: 'gin',
    name: 'control_report_templates_risks_gin',
  })
  await queryInterface.addIndex('control_report_templates', ['language'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('control_report_templates')
}
