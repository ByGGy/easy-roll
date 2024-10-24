declare const NOMINAL_BRAND: unique symbol
export type Nominal<T extends string, U> = U & { [NOMINAL_BRAND]: T }

export type EntityId = string

export type Entity = {
  id: Readonly<EntityId>
}

export type RollCheckFactor = {
  type: 'base' | 'offset' | 'multiplier'
  name: string
  value: number
}

export type RollCheckDetails = {
  factors: Array<RollCheckFactor>
  successThreshold: number
}

export type RollDiceDetails = {
  diceFaceQty: number
  diceQty: number
  modifier: number
  
  rolls: Array<number>
  total: number
}

export type RollResult = {
  characterId: EntityId
  checkDetails: RollCheckDetails | null
  diceDetails: RollDiceDetails
}