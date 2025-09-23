let userType = 'normal'

const mockUsers = {
  admin: {
    id: 'testuser',
    username: 'hy-hlo-1441871',
    firstName: 'Testi',
    lastName: 'Kayttaja',
    email: 'grp-toska@helsinki.fi',
    language: 'fi',
    isAdmin: true,
    iamGroups: ['grp-toska', 'hy-mltdk-employees'],
  },
  normal: {
    id: 'normaltestuser',
    username: 'hy-hlo-22222',
    firstName: 'Matti',
    lastName: 'Luukkainen',
    email: 'matti.luukkainen@helsinki.fi',
    language: 'fi',
    isAdmin: false,
    iamGroups: ['hy-mltdk-employees'],
  },
}

export const getMockUser = () => {
  return mockUsers[userType]
}

export const setMockUser = type => {
  userType = type
}
