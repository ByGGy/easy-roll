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

export type Game = 'Aria' | 'Rêve de Dragon' | 'BaSIC' | 'Deadlands'

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

type CharacterRollKind = 'diceTray'
  | 'diceAction'
  | 'ariaCheckAttribute'
  | 'ariaCheckAbility'
  | 'rddCheckAttribute'
  | 'basicCheckAttribute'
  | 'basicCheckAbility'
  | 'deadlandsCheckAttribute'
  | 'deadlandsCheckAbility'

export type BaseCharacterRollRequest<T extends CharacterRollKind> = Readonly<{
  game: Game
  characterId: EntityId
  kind: T
}>

export type DiceTrayRequest = BaseCharacterRollRequest<'diceTray'> & Readonly<{
  expression: string
}>

export type DiceActionRequest = BaseCharacterRollRequest<'diceAction'> & Readonly<{
  actionName: string
}>

export type AriaCheckAttributeRequest = BaseCharacterRollRequest<'ariaCheckAttribute'> & Readonly<{
  attributeName: string
  difficulty: number
  modifier: number
}>

export type AriaCheckAbilityRequest = BaseCharacterRollRequest<'ariaCheckAbility'> & Readonly<{
  abilityName: string
  modifier: number
}>

export type RDDCheckAttributeRequest = BaseCharacterRollRequest<'rddCheckAttribute'> & Readonly<{
  attributeName: string
  abilityName: string
  modifier: number
}>

export type BasicCheckAttributeRequest = BaseCharacterRollRequest<'basicCheckAttribute'> & Readonly<{
  attributeName: string
  modifier: number
}>

export type BasicCheckAbilityRequest = BaseCharacterRollRequest<'basicCheckAbility'> & Readonly<{
  abilityName: string
  difficulty: number
  modifier: number
}>

export type DeadlandsCheckAttributeRequest = BaseCharacterRollRequest<'deadlandsCheckAttribute'> & Readonly<{
  attributeName: string
  modifier: number
  difficulty: number  
}>

export type DeadlandsCheckAbilityRequest = BaseCharacterRollRequest<'deadlandsCheckAbility'> & Readonly<{
  abilityName: string
  modifier: number
  difficulty: number  
}>

export type CharacterRollRequest = DiceTrayRequest
  | DiceActionRequest
  | AriaCheckAttributeRequest
  | AriaCheckAbilityRequest
  | RDDCheckAttributeRequest
  | BasicCheckAttributeRequest
  | BasicCheckAbilityRequest
  | DeadlandsCheckAttributeRequest
  | DeadlandsCheckAbilityRequest

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

export type RollResult = Entity & {
  request: CharacterRollRequest
  title: string
  outcome: RollOutcome
  outcomeDetails: RollOutcomeDetails
  diceDetails: RollDiceDetails
  checkDetails: RollCheckDetails | null
}