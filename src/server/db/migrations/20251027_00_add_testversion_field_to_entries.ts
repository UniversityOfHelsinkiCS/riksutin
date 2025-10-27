import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('entries', 'test_version', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('entries', 'test_version')
}
