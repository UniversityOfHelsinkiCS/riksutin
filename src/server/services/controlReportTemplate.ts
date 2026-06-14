import {
  CreateControlReportTemplateType,
  CreateControlReportTemplateZod,
  UpdateControlReportTemplateType,
  UpdateControlReportTemplateZod,
} from '@validators/controlReportTemplate'

import { ControlReportTemplate } from '@dbmodels'
import NotFoundError from '../errors/NotFoundError'
import ZodValidationError from '../errors/ValidationError'

export const getControlReportTemplates = async (language?: string): Promise<ControlReportTemplate[]> => {
  const where = language ? { language } : undefined

  return await ControlReportTemplate.findAll({
    ...(where ? { where } : {}),
    order: [['updatedAt', 'DESC']],
  })
}

export const getControlReportTemplateById = async (id: string): Promise<ControlReportTemplate> => {
  const template = await ControlReportTemplate.findByPk(id)

  if (!template) {
    throw new NotFoundError('No control report template with this id')
  }

  return template
}

export const createControlReportTemplate = async (
  values: CreateControlReportTemplateType
): Promise<ControlReportTemplate> => {
  const request = CreateControlReportTemplateZod.safeParse(values)

  if (!request.success) {
    throw new ZodValidationError('Validation of control report template inputs failed', request.error.issues)
  }

  const template = await ControlReportTemplate.create(request.data)
  return template
}

export const updateControlReportTemplate = async (
  templateId: string,
  values: UpdateControlReportTemplateType
): Promise<ControlReportTemplate> => {
  const template = await ControlReportTemplate.findByPk(templateId)

  if (!template) {
    throw new NotFoundError('No control report template with this id')
  }

  const request = UpdateControlReportTemplateZod.safeParse(values)

  if (!request.success) {
    throw new ZodValidationError('Validation of control report template update values failed', request.error.issues)
  }

  Object.assign(template, request.data)
  await template.save()

  return template
}

export const deleteControlReportTemplate = async (templateId: string): Promise<ControlReportTemplate> => {
  const template = await ControlReportTemplate.findByPk(templateId)

  if (!template) {
    throw new NotFoundError('No control report template with this id')
  }

  await template.destroy()
  return template
}
