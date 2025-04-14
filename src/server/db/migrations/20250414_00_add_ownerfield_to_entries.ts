import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('entries', 'owner_id', {
    type: DataTypes.STRING,
    allowNull: true,
  })

  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        owner_id = user_id
  `)
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('entries', 'owner_id')
}
