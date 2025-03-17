import i18n from 'i18next'
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend'
import logger from './logger'

await i18n
  .use(FsBackend)
  .init<FsBackendOptions>({
    fallbackLng: 'en',
    supportedLngs: ['fi', 'en'],
    ns: ['translation'], // https://www.i18next.com/principles/fallback#namespace-fallback
    defaultNS: 'translation',
    fallbackNS: 'translation',
    load: 'all', // load all langs on initialization
    preload: ['fi', 'en'], // preload all langs. This is needed for getFixedT to properly work in backend
    backend: {
      // working directory is src/server
      loadPath: '../locales/{{lng}}.json',
    },
    debug: false, // turn on for debugging
    nsSeparator: '.',
    keySeparator: ':',
  })
  .then(t => {
    logger.info(`Welcome to ${t('common:appName')}`)
  })

export default i18n
