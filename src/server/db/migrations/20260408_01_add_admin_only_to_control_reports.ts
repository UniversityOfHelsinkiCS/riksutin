import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('control_reports', 'admin_only', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('control_reports', 'admin_only')
}
