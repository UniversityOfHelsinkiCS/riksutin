import { CONTROL_REPORT_TEMPLATE_LANGUAGES, CONTROL_REPORT_TEMPLATE_RISKS } from '@common/controlReportTemplate'
import { z } from 'zod'

const riskSchema = z.enum(CONTROL_REPORT_TEMPLATE_RISKS)
const languageSchema = z.enum(CONTROL_REPORT_TEMPLATE_LANGUAGES)

export const CreateControlReportTemplateZod = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  risks: z.array(riskSchema).min(1, 'At least one risk is required'),
  language: languageSchema,
  text: z.string().trim().min(1, 'Text is required'),
})

export type CreateControlReportTemplateType = z.infer<typeof CreateControlReportTemplateZod>

export const UpdateControlReportTemplateZod = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  risks: z.array(riskSchema).min(1, 'At least one risk is required'),
  language: languageSchema,
  text: z.string().trim().min(1, 'Text is required'),
})

export type UpdateControlReportTemplateType = z.infer<typeof UpdateControlReportTemplateZod>
