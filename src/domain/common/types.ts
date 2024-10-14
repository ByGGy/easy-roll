declare const NOMINAL_BRAND: unique symbol
export type Nominal<T extends string, U> = U & { [NOMINAL_BRAND]: T }

export type EntityId = string

export type Entity = {
  id: Readonly<EntityId>
}