import { EmployeeResponse } from '@routes/types'
import mockUser from './user'

const mockEmplyee: EmployeeResponse[] = [
  {
    id: mockUser.id,
    employeeNumber: '',
    username: mockUser.username,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  },
]

export default mockEmplyee
