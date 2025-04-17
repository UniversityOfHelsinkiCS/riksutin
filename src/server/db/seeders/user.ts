import { User } from '@dbmodels'

const user = {
  id: 'testuser',
  username: 'hy-hlo-1441871',
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
