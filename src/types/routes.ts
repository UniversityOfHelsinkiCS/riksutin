export interface GenericError {
  error: string
}
export type CanError<T, E = GenericError> = T | E

/**
 * NOTE: username in this case is the AD-identifier
 */
export type EmployeeResponse = {
  id: string
  employeeNumber: string
  username: string
  firstName: string
  lastName: string
  email: string
}
