import { DataTypes } from 'sequelize'

import { Migration } from '../connection'
// eslint-disable-next-line no-console
console.log('WTF1')

export const up: Migration = async ({ context: queryInterface }) => {
  // eslint-disable-next-line no-console
  console.log('WTF2')

  await queryInterface.createTable('warnings', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
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
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('warnings')
}
