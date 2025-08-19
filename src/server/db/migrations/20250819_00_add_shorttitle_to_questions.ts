import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('questions', 'short_title', {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('questions', 'short_title')
}
