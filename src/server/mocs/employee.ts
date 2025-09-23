import { EmployeeResponse } from '@routes/types'
import { getMockUser } from './user'

const mockUser = getMockUser()

const mockEmplyee: EmployeeResponse[] = [
  {
    employeeNumber: '',
    username: mockUser.id,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  },
  {
    employeeNumber: '123',
    username: 'mluukkai',
    firstName: 'Matti',
    lastName: 'Luukkainen',
    email: 'matti.luukkainen@helsinki.fi',
  },
  {
    employeeNumber: '234',
    username: 'outisavo',
    firstName: 'Outi',
    lastName: 'Savolainen',
    email: 'outi.savolainen@helsinki.fi',
  },
]

export default mockEmplyee
