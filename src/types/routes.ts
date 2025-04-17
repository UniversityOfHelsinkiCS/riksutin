export interface GenericError {
  error: string
}
export type CanError<T, E = GenericError> = T | E

export type EmployeeResponse = {
  employeeNumber: string
  username: string
  firstName: string
  lastName: string
  email: string
}
