import { User } from '@dbmodels'

const user = {
  id: 'hy-hlo-1441871',
  username: 'testuser',
  firstName: 'Testi',
  lastName: 'Kayttaja',
  email: 'grp-toska@helsinki.fi',
  language: 'fi',
  isAdmin: true,
  lastLoggedIn: new Date(),
}

const seedUsers = async () => {
  await User.upsert({
    ...user,
  })
}

export default seedUsers
