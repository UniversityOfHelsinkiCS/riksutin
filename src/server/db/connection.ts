import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'

import { DATABASE_URL } from '@server/config'
import logger from '../util/logger'
import { t } from 'i18next'

const DB_CONNECTION_RETRY_LIMIT = 10

export const sequelize = new Sequelize(DATABASE_URL, { logging: false })

const umzug = new Umzug({
  migrations: { glob: './db/migrations/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

export type Migration = typeof umzug._types.migration

const runMigrations = async () => {
  const migrations = await umzug.up()

  logger.info('Migrations up to date', {
    migrations,
  })
}

const testConnection = async () => {
  await sequelize.authenticate()
  try {
    await runMigrations()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    // eslint-disable-next-line no-console
    console.error('Error running migrations', {
      error: (err as Error).stack,
    })
    throw new Error(t('db.connection.migrationError'))
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const connectToDatabase = async (attempt = 0): Promise<void | null> => {
  try {
    await testConnection()
  } catch (err) {
    if (attempt === DB_CONNECTION_RETRY_LIMIT) {
      logger.error(`Connection to database failed after ${attempt} attempts`, {
        error: (err as Error).stack,
      })

      return process.exit(1)
    }
    logger.info(`Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`)
    logger.error('Database error: ', err)
    await sleep(5000)

    return connectToDatabase(attempt + 1)
  }

  return null
}
