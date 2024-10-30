declare const NOMINAL_BRAND: unique symbol
export type Nominal<T extends string, U> = U & { [NOMINAL_BRAND]: T }

export type EntityId = string

export type Entity = {
  id: Readonly<EntityId>
}

//--

export type Game = 'Aria' | 'Rêve de Dragon'

export type Attribute = Nominal<'Attribute', Readonly<{
  name: string,
  value: number
}>>

export type Ability = Nominal<'Ability', Readonly<{
  name: string,
  value: number
}>>

export type DiscordConfiguration = {
  channelId: string
}

export type CharacterSheet = Entity & Readonly<{
  game: Game
  name: string
  attributes: Array<Attribute>
  abilities: Array<Ability>
  discordConfiguration: DiscordConfiguration
}>

//--

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