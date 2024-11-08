export const isNotNull = <T>(argument: T | null): argument is T => {
  return argument !== null
}

export const isNotUndefined = <T>(argument: T | undefined): argument is T => {
  return argument !== undefined
}

export const unreachable = (x: never): never => {
  throw new TypeError(`Didn't expect to get ${JSON.stringify(x)} here`)
}