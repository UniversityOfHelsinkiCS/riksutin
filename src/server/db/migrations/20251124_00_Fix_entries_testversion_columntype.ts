import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('entries', 'test_version', {
    type: 'BOOLEAN USING CAST("test_version" as BOOLEAN)',
    allowNull: false,
    defaultValue: false,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('entries', 'test_version', {
    type: 'STRING USING CAST("test_version" as STRING)',
    allowNull: false,
    defaultValue: false,
  })
}
