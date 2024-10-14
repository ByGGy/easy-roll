export const isNotNull = <T>(argument: T | null): argument is T => {
  return argument !== null
}