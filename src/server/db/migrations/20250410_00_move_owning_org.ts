import { Migration } from '../connection'

export const up: Migration = async ({ context: queryInterface }) => {
  // MOVE existing responsible org to a new key
  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        data = JSONB_SET(data, '{answers,unit}', data->'answers'->'2', true)
      WHERE
        data->'answers' ? '2' AND NOT data->'answers' ? 'unit'
    `)

  // DROP the old responsible org key
  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        data = data #- '{answers,2}'
      WHERE
        data->'answers' ? '2'
    `)

  // COPY the project adder is now the owner
  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        data = JSONB_SET(data, '{answers,2}', data->'answers'->'1')
    `)

  // DROP answer "2"
  await queryInterface.sequelize.query(`
      DELETE FROM
        questions
      WHERE
        id = 2
    `)
}

export const down: Migration = async ({ context: queryInterface }) => {
  // DROP the project owner
  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        data = data #- '{answers,2}'
      WHERE
        data->'answers' ? '2'
    `)

  // MOVE responsible org (code) to old key
  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        data = JSONB_SET(data, '{answers,2}', data->'answers'->'unit')
    `)

  // DROP responsible org
  await queryInterface.sequelize.query(`
      UPDATE
        entries
      SET
        data = data #- '{answers,'unit'}'
    `)

  // DROP answer "2"
  await queryInterface.sequelize.query(`
      DELETE FROM
        questions
      WHERE
        id = 2
    `)
}
