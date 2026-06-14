export const CONTROL_REPORT_TEMPLATE_RISKS = [
  'riskComponent:total',
  'riskComponent:economicRisk',
  'riskComponent:ethicalRisk',
  'riskComponent:dualUseRisk',
  'riskComponent:gdprRisk',
  'riskComponent:highRiskCountry',
] as const

export const CONTROL_REPORT_TEMPLATE_LANGUAGES = ['fi', 'en'] as const

export type ControlReportTemplateRisk = (typeof CONTROL_REPORT_TEMPLATE_RISKS)[number]
export type ControlReportTemplateLanguage = (typeof CONTROL_REPORT_TEMPLATE_LANGUAGES)[number]
