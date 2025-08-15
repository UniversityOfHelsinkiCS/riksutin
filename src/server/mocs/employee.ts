import { EmployeeResponse } from '@routes/types'
import mockUser from './user'

const mockEmplyee: EmployeeResponse[] = [
  {
    employeeNumber: '',
    username: mockUser.username,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  },
]

export default mockEmplyee
