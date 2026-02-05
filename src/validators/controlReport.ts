import { z } from 'zod'

export const CreateControlReportZod = z.object({
  text: z.string().min(1, 'Text is required'),
})

export type CreateControlReportType = z.infer<typeof CreateControlReportZod>

export const UpdateControlReportZod = z.object({
  text: z.string().min(1, 'Text is required'),
})

export type UpdateControlReportType = z.infer<typeof UpdateControlReportZod>
