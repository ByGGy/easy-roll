declare const NOMINAL_BRAND: unique symbol
export type Nominal<T extends string, U> = U & { [NOMINAL_BRAND]: T }

export type EntityId = string

export type Entity = {
  id: Readonly<EntityId>
}

export type EntityWithState<T> = Entity & {
  state: T
}

//--

export type Game = 'Aria' | 'Rêve de Dragon' | 'BaSIC'

export type Attribute = Nominal<'Attribute', Readonly<{
  name: string
  value: number
}>>

export type Ability = Nominal<'Ability', Readonly<{
  name: string
  value: number
}>>

export type DiceAction = Nominal<'DiceAction', Readonly<{
  name: string
  expression: string
}>>

export const createDiceAction = (name: string, expression: string): DiceAction => {
  return { name, expression } as DiceAction
}

export type NotificationLevel = 'Strict' | 'Standard' | 'Verbose'

export type DiscordNotification = {
  enable: boolean
  level: NotificationLevel
  channelId: string
}

//--

export type RollCheckOutcome = 'success' | 'failure'
export type RollCheckQuality = 'critical' | 'particular' | 'significant' | 'normal'

export type RollOutcome = 'value' | RollCheckOutcome

export const IsCheckOutcome = (outcome: RollOutcome): outcome is RollCheckOutcome => {
  return outcome === 'success' || outcome === 'failure'
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

export type RollDiceGroup = {
  diceQty: number
  diceFaceQty: number
  rolls: Array<number>
}

export type RollDiceDetails = {
  groups: Array<RollDiceGroup>
  total: number
}

export type RollOutcomeDetails = {
  quality: RollCheckQuality
}

export type RollResult = {
  characterId: EntityId
  title: string
  outcome: RollOutcome
  outcomeDetails: RollOutcomeDetails
  diceDetails: RollDiceDetails
  checkDetails: RollCheckDetails | null
}