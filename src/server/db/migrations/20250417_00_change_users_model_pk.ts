import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE entries
    ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
  `)

  await queryInterface.sequelize.query(`
    ALTER TABLE entries
    ADD CONSTRAINT fk_owner
    FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE
  `)

  // TEMP SWAP
  await queryInterface.sequelize.query('ALTER TABLE users ADD COLUMN temp_id VARCHAR(255)')
  await queryInterface.sequelize.query('ALTER TABLE users ADD COLUMN temp_username VARCHAR(255)')

  await queryInterface.sequelize.query('UPDATE users SET temp_id = id, temp_username = username')
  await queryInterface.sequelize.query('UPDATE users SET id = temp_username, username = temp_id')

  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN temp_id')
  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN temp_username')
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query('ALTER TABLE users ADD COLUMN temp_id VARCHAR(255)')
  await queryInterface.sequelize.query('ALTER TABLE users ADD COLUMN temp_username VARCHAR(255)')

  await queryInterface.sequelize.query('UPDATE users SET temp_id = id, temp_username = username')
  await queryInterface.sequelize.query('UPDATE users SET id = temp_username, username = temp_id')

  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN temp_id')
  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN temp_username')

  await queryInterface.sequelize.query(`
    ALTER TABLE entries
    DROP CONSTRAINT fk_user
    DROP CONSTRAINT fk_owner
  `)
}
