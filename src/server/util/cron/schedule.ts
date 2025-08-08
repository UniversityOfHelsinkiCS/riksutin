import cron from 'node-cron'

const scheduleCronJob = (cronExpression: string, job: (now: Date | 'manual' | 'init') => void) => {
  cron.schedule(cronExpression, job, {
    scheduled: true,
    timezone: 'Europe/Helsinki',
  })
}

export default scheduleCronJob
