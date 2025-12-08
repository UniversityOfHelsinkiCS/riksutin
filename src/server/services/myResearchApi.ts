import { Entry, Result } from '@dbmodels'
import { Op } from 'sequelize'
import i18n from '../util/i18n'
import { MyResearchData, CountriesData, RiskAnalysisData } from '@server/types'
import { Locales, CountryData } from '@types'

const getResultText = (project: Entry, results: Result[], key: string): string => {
  // Based on answers and risk algorithm, the risk level can be undefined
  // 5 can never be risk level
  const level = project.data.risks.find(obj => obj.id === 'total')?.level ?? 5
  return level === 5
    ? ''
    : (results.find(r => r.optionLabel === `${key}${level}`)?.isSelected['en' as keyof Locales] ?? '')
}

const createCountriesList = (countries: CountryData[], results: Result[]): CountriesData[] => {
  const t = i18n.getFixedT('en')
  if (!countries) {
    return []
  }
  const countriesList = countries.map(country => ({
    code: country.code ?? '',
    name: country.name ?? '',
    countryRisk: {
      title: t('riskTable:countryRiskLevel'),
      riskValues: country.countryRisk?.riskValues ?? [],
      totalCountryRiskLevel: country.countryRisk?.totalCountryRiskLevel ?? 0,
      rawTotalCountryRiskLevel: country.countryRisk?.rawTotalCountryRiskLevel ?? 0,
      infoText: '',
    },
    corruption: {
      title: t('riskTable:corruptionRank'),
      level: country.corruption ?? 0,
      infoText:
        results.find(r => r.optionLabel === `corruption${country.corruption}`)?.isSelected['en' as keyof Locales] ?? '',
    },
    safetyLevel: {
      title: t('riskTable:safetyLevel'),
      level: country.safetyLevel ?? 0,
      infoText:
        results.find(r => r.optionLabel === `safetyLevel${country.safetyLevel}`)?.isSelected['en' as keyof Locales] ??
        '',
    },
    academicFreedom: {
      title: t('riskTable:academicFreedom'),
      level: country.academicFreedom ?? 0,
      infoText:
        results.find(r => r.optionLabel === `academicFreedom${country.academicFreedom}`)?.isSelected[
          'en' as keyof Locales
        ] ?? '',
    },
    stability: {
      title: t('riskTable:stabilityRank'),
      level: country.stability ?? 0,
      infoText:
        results.find(r => r.optionLabel === `politicalStability${country.stability}`)?.isSelected[
          'en' as keyof Locales
        ] ?? '',
    },
    humanDevelopment: {
      title: t('riskTable:HCIrank'),
      level: country.hci ?? 0,
      infoText: results.find(r => r.optionLabel === `HCI${country.hci}`)?.isSelected['en' as keyof Locales] ?? '',
    },
    gdpr: {
      title: 'GDPR',
      level: country.gdpr ?? 0,
      infoText: results.find(r => r.optionLabel === `GDPR${country.gdpr}`)?.isSelected['en' as keyof Locales] ?? '',
    },
    sanctions: {
      title: t('riskTable:sanctions'),
      level: country.sanctions ?? 0,
      infoText:
        results.find(r => r.optionLabel === `sanctions${country.sanctions}`)?.isSelected['en' as keyof Locales] ?? '',
    },
    ruleOfLaw: {
      title: t('riskTable:ruleOfLaw'),
      level: country.ruleOfLaw ?? 0,
      infoText:
        results.find(r => r.optionLabel === `ruleOfLaw${country.ruleOfLaw}`)?.isSelected['en' as keyof Locales] ?? '',
    },
  }))

  return countriesList
}

const createRiskAnalysisObject = (project: Entry, results: Result[]): RiskAnalysisData => {
  const t = i18n.getFixedT('en')
  const data = project.data.updatedData?.find(pr => pr.createdAt === project.data.updatedData) ?? project.data

  const riskWithEconomicScope = project.updatedAt.getTime() > new Date('2025-11-06T22:00:00.000Z').getTime()
  const hyMultilateral = project.data.answers['9'] === 'coordinator' && project.data.answers['4'] === 'multilateral'

  const multiplierArray = [
    data.answers['9'] === 'coordinator' ? t('riskTable:roleMultiplier') : '',
    data.answers['12'] === 'longDuration' ? t('riskTable:durationMultiplier') : '',
    data.answers['10'] === 'agreementNotDone' ? t('riskTable:agreementMultiplier') : '',
    data.answers['24'] === 'noSuccessfulCollaboration' ? t('riskTable:previousCollaborationMultiplier') : '',
  ]

  const economiAdditionalArray = [
    data.answers['14'] && data.answers['14'] === 'notPreviouslyFunded' ? t('riskTable:previousFunding') : '',
    data.answers['15'] && (data.answers['15'] === 'internationalCompany' || data.answers['15'] === 'finnishCompany')
      ? t('riskTable:companyBased')
      : '',
  ]
  // TODO Same functions as in RiskTable. do something
  const multiplierInfoText =
    multiplierArray.filter(m => m !== '').length > 0
      ? t(
          `${t('riskTable:riskMultipliers')} ${multiplierArray
            .filter(m => m !== '')
            .join(', ')
            .replace(/,(?=[^,]+$)/, ` ${t('riskTable:and')}`)}.`
        )
      : ''

  const economicAdditionalInfoText =
    economiAdditionalArray.filter(m => m !== '').length > 0
      ? t(
          `${t('riskTable:economicAdditional')} ${economiAdditionalArray
            .filter(m => m !== '')
            .join(', ')
            .replace(' yritys,', ` yritys ${t('riskTable:and')}`)
            .replace(' company,', ` company ${t('riskTable:and')}`)}.`
        )
      : riskWithEconomicScope
        ? ' '
        : (results.find(r => r.optionLabel === `economicScope${data.risks.find(obj => obj.id === 'economic')?.level}`)
            ?.isSelected['en' as keyof Locales] ?? '')

  const formattedProject = {
    totalRisk: {
      title: t('riskTable:totalRiskLevel'),
      level: data.risks.find(obj => obj.id === 'total')?.level ?? 0,
      infoText: `${getResultText(project, results, 'total')} ${multiplierInfoText}`,
    },
    countryTotal: {
      title: t('riskTable:countryRiskLevel'),
      level: data.risks.find(obj => obj.id === 'country')?.level ?? 0,
      infoText: getResultText(project, results, 'country'),
      countries: {
        totalCountriesData: createCountriesList(data.country, results),
        multilateralCountriesData: createCountriesList(data.multilateralCountries, results),
      },
    },
    university: {
      title: t('riskTable:universityRiskLevel'),
      level: data.risks.find(obj => obj.id === 'university')?.level ?? 0,
      infoText: getResultText(project, results, 'university'),
    },
    organisation: {
      title: t('riskTable:organisationRiskLevel'),
      level: data.risks.find(obj => obj.id === 'organisation')?.level ?? 0,
      infoText: getResultText(project, results, 'organisation'),
    },
    duration: {
      title: t('riskTable:durationRiskLevel'),
      level: data.risks.find(obj => obj.id === 'duration')?.level ?? 0,
      infoText: getResultText(project, results, 'duration'),
    },
    economic: {
      title: t('riskTable:economicRiskLevel'),
      level: data.risks.find(obj => obj.id === 'economic')?.level ?? 0,
      infoText: economicAdditionalInfoText,
      economicExchange: {
        title: t('riskTable:economicExchangeRiskLevel'),
        level: data.risks.find(obj => obj.id === 'economicExchange')?.level ?? 0,
        infoText: getResultText(project, results, 'economicExchange'),
      },
      economicScope: {
        title: t('riskTable:economicScopeRiskLevel'),
        level: data.risks.find(obj => obj.id === 'economicScope')?.level ?? 0,
        infoText: getResultText(project, results, 'economicScope'),
      },
    },
    dualUse: {
      title: t('riskTable:dualUseRiskLevel'),
      level: data.risks.find(obj => obj.id === 'dualUse')?.level ?? 0,
      infoText: getResultText(project, results, 'dualUse'),
    },
    ethical: {
      title: t('riskTable:ethicalRiskLevel'),
      level: data.risks.find(obj => obj.id === 'ethical')?.level ?? 0,
      infoText: getResultText(project, results, 'ethical'),
    },
    consortium: {
      title: t('riskTable:consortiumRiskLevel'),
      level: data.risks.find(obj => obj.id === 'consortium')?.level ?? 0,
      infoText: getResultText(project, results, 'consortium'),
    },
  }

  Object.keys(formattedProject).forEach(dataObjKey => {
    if (
      formattedProject[dataObjKey].level === 0 ||
      (formattedProject[dataObjKey].economicExchange && formattedProject[dataObjKey].economicExchange.level === 0) ||
      (formattedProject[dataObjKey].economicScope && formattedProject[dataObjKey].economicScope.level === 0) ||
      (!hyMultilateral && dataObjKey === 'consortium')
    ) {
      delete formattedProject[dataObjKey]
    }
  })

  return formattedProject
}

export const getRisksWithTuhatProject = async (): Promise<MyResearchData[]> => {
  const projectsWithTuhatProject = await Entry.findAll({
    where: {
      testVersion: false,
      tuhatData: {
        tuhatId: {
          [Op.not]: null,
        },
      },
    },
  })

  const results = await Result.findAll({
    where: {
      surveyId: 1,
    },
  })

  const formattedTuhatProjects = projectsWithTuhatProject.map(project => ({
    tuhatId: project.tuhatData.tuhatId,
    riskAnalysis: createRiskAnalysisObject(project, results),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }))

  // The shown fields depends on the answers given. Remove all the risks that are not relevant for a risk analysis.
  return formattedTuhatProjects
}

export const getRiskWithTuhatProjectId = async (projectId: string): Promise<MyResearchData> => {
  const projectsWithTuhatProject = await Entry.findAll({
    where: {
      testVersion: {
        [Op.not]: true,
      },

      tuhatData: {
        tuhatId: projectId,
      },
    },
  })

  const results = await Result.findAll({
    where: {
      surveyId: 1,
    },
  })

  const formattedTuhatProject = projectsWithTuhatProject.map(project => ({
    tuhatId: project.tuhatData.tuhatId,
    riskAnalysis: createRiskAnalysisObject(project, results),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }))

  return formattedTuhatProject[0]
}
