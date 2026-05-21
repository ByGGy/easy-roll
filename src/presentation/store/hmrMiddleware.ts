import { Middleware, UnknownAction } from 'redux'

export const recoverState = <T>() => {
  const data = sessionStorage.getItem("redux-dev-state")
  if (data) {
    return JSON.parse(data) as T
  }

  return undefined
}

export const hmrMiddleware: Middleware = (store) => (next) => (action: UnknownAction) => {

  sessionStorage.setItem(
    "redux-dev-state",
    JSON.stringify(store.getState())
  )

  // Pass all actions through by default
  return next(action)
}