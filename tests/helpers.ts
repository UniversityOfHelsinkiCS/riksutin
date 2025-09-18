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
  return [
    {
      id: 'country',
      title: 'riskTable:countryRiskLevel',
      level: object.find(f => f.id === 'country').level,
    },
    {
      id: 'university',
      title: 'riskTable:universityRiskLevel',
      level: object.find(f => f.id === 'university').level,
    },
    {
      id: 'dualUse',
      title: 'riskTable:dualUseRiskLevel',
      level: object.find(f => f.id === 'dualUse').level,
    },
    {
      id: 'economic',
      title: 'riskTable:economicRiskLevel',
      level: object.find(f => f.id === 'economic').level,
    },
    {
      id: 'ethical',
      title: 'riskTable:ethicalRiskLevel',
      level: object.find(f => f.id === 'ethical').level,
    },
    {
      id: 'total',
      title: 'riskTable:totalRiskLevel',
      level: object.find(f => f.id === 'total').level,
    },
  ]
}
