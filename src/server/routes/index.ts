import express from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'

import { inDevelopment, inE2EMode, inAcualStaging } from '@config'
import initializeSentry from '../util/sentry'
import userMiddleware from '../middleware/user'
import sentryUserMiddleware from '../middleware/sentry'
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
import { setMockUser } from '../mocs/user'
import adminHandler from '../middleware/admin'

const router = express()

initializeSentry()

router.use(cors())
router.use(express.json())

if (inDevelopment || inE2EMode || inAcualStaging) {
  router.use(userMiddleware)
}

// Set Sentry user context after user middleware
router.use(sentryUserMiddleware)

router.use(accessLogger)

if (inDevelopment || inE2EMode) {
  router.get('/mock/user', (req, res) => {
    const { type } = req.query
    const setTo: any = type ?? 'normal'
    setMockUser(setTo)
    res.send('changed mock user to ' + setTo)
  })
}

router.get('/ping', (_, res) => res.send('pong'))
router.get('/explode', adminHandler, () => {
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

router.get('/explode', () => {
  throw new Error('bad thing happened')
})

Sentry.setupExpressErrorHandler(router)
router.use(errorHandler)

export default router
