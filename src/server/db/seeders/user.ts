import { User } from '@dbmodels'

const adminUuser = {
  id: 'testuser',
  username: 'hy-hlo-1441871',
  firstName: 'Testi',
  lastName: 'Kayttaja',
  email: 'grp-toska@helsinki.fi',
  language: 'fi',
  isAdmin: true,
  lastLoggedIn: new Date(),
}

const user = {
  id: 'normaltestuser',
  username: 'hy-hlo-22222',
  firstName: 'Normaali',
  lastName: 'Kayttaja',
  email: 'matti.luukkainen@helsinki.fi',
  language: 'fi',
  isAdmin: false,
  lastLoggedIn: new Date(),
}

const seedUsers = async () => {
  await User.upsert({
    ...adminUuser,
  })
  await User.upsert({
    ...user,
  })
}

export default seedUsers
