import { DataTypes } from 'sequelize'

import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('entry_state_changes', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'entries',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    from_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to_state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  })

  await queryInterface.addIndex('entry_state_changes', ['entry_id'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('entry_state_changes')
}
