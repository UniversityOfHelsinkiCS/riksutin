import express from 'express'
import cors from 'cors'
import { Handlers as SentryHandlers } from '@sentry/node'

import { inDevelopment, inE2EMode, inAcualStaging } from '@config'
import userMiddleware from '../middleware/user'
import initializeSentry from '../util/sentry'
import errorHandler from '../middleware/error'
import accessLogger from '../middleware/access'
import facultyRouter from './faculty'
import surveyRouter from './survey'
import resultRouter from './result'
import entryRouter from './entry'
import userRouter from './user'
import loginRouter from './login'
import questionRouter from './question'
import countryRouter from './country'
import organizationRouter from './organization'
import warningsRouter from './warning'
import tuhatProjectsRouter from './tuhatProject'

const router = express()

initializeSentry(router)

router.use(SentryHandlers.requestHandler())
router.use(SentryHandlers.tracingHandler())

router.use(cors())
router.use(express.json())

if (inDevelopment || inE2EMode || inAcualStaging) router.use(userMiddleware)

router.use(accessLogger)

router.get('/ping', (_, res) => res.send('pong'))
router.get('/error', () => {
  throw new Error('Test error')
})

router.use('/faculties', facultyRouter)
router.use('/surveys', surveyRouter)
router.use('/questions', questionRouter)
router.use('/results', resultRouter)
router.use('/entries', entryRouter)
router.use('/users', userRouter)
router.use('/login', loginRouter)
router.use('/countries', countryRouter)
router.use('/organizations', organizationRouter)
router.use('/warnings', warningsRouter)
router.use('/tuhatprojects', tuhatProjectsRouter)

router.use(SentryHandlers.errorHandler())
router.use(errorHandler)

export default router
