import { expect } from '@playwright/test'

export const testUser = {
  id: 'hy-hlo-1441871',
  username: 'testuser',
  firstName: 'Testi',
  lastName: 'Kayttaja',
  email: 'grp-toska@helsinki.fi',
  language: 'fi',
  isAdmin: true,
  iamGroups: ['grp-toska', 'hy-mltdk-employees'],
}

export const riskResponse = object => {
  const ids = [
    'consortium',
    'country',
    'dualUse',
    'dualUseEU',
    'dualUseNonEU',
    'economic',
    'economicScope',
    'economicExchange',
    'ethical',
    'total',
    'university',
  ].sort()

  const risks = ids.reduce((acc, id) => {
    const found = object.find(f => f.id === id)
    if (found) {
      return [
        ...acc,
        {
          id,
          title:
            id === 'dualUseEU' || id === 'dualUseNonEU' ? 'riskTable:dualUseRiskLevel' : `riskTable:${id}RiskLevel`,
          level: found.level,
        },
      ]
    }
    return acc
  }, [] as any)

  return risks
}

export const compareUnordered = (actual: any[], expected: any[]) => {
  const sortFn = (a: any, b: any) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
  expect([...actual].sort(sortFn)).toStrictEqual([...expected].sort(sortFn))
}

export const compareOrdered = (actual: any[], expected: any[]) => {
  expect(actual.length).toBe(expected.length)

  for (let i = 0; i < actual.length; i++) {
    expect(actual[i]).toMatchObject(expected[i])
  }
}
