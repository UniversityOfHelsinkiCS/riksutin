export interface GenericError {
  error: string
}
export type CanError<T, E = GenericError> = T | E

/** NOTE: username is the email, value is the name. */
export type EmployeeResponse = { username: string; value: string }
