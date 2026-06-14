import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  // Convert existing single-value risk column to a JSONB array column named risks
  await queryInterface.addColumn('control_report_templates', 'risks', {
    type: DataTypes.JSONB,
    allowNull: true,
  })

  // Migrate existing data: wrap single string value into a JSON array
  await queryInterface.sequelize.query(`
    UPDATE control_report_templates
    SET risks = to_jsonb(ARRAY[risk])
  `)

  // Set not-null now that all rows are populated
  await queryInterface.changeColumn('control_report_templates', 'risks', {
    type: DataTypes.JSONB,
    allowNull: false,
  })

  // Drop the old index and column
  await queryInterface.removeIndex('control_report_templates', 'control_report_templates_risk')
  await queryInterface.removeColumn('control_report_templates', 'risk')

  // Add GIN index on new jsonb column
  await queryInterface.addIndex('control_report_templates', ['risks'], {
    using: 'gin',
    name: 'control_report_templates_risks_gin',
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('control_report_templates', 'risk', {
    type: DataTypes.STRING,
    allowNull: true,
  })

  // Migrate back: take first element of the array
  await queryInterface.sequelize.query(`
    UPDATE control_report_templates
    SET risk = (risks->>0)::varchar
  `)

  await queryInterface.changeColumn('control_report_templates', 'risk', {
    type: DataTypes.STRING,
    allowNull: false,
  })

  await queryInterface.removeIndex('control_report_templates', 'control_report_templates_risks_gin')
  await queryInterface.removeColumn('control_report_templates', 'risks')

  await queryInterface.addIndex('control_report_templates', ['risk'], {
    name: 'control_report_templates_risk',
  })
}
