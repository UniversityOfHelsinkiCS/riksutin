import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('entries', 'tuhat_data', {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('entries', 'tuhat_data')
}
