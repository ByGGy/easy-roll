import { Entity, Nominal } from '../common/types'

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
  game: string
  name: string
  attributes: Array<Attribute>
  abilities: Array<Ability>
  discordConfiguration: DiscordConfiguration
}>

// TODO: need better validation..
export const isCharacterSheet = (o: unknown): o is CharacterSheet => {
  return (o !== null)
    && (o !== undefined)
    && ((o as CharacterSheet).id !== undefined)
    && ((o as CharacterSheet).game !== undefined)
    && ((o as CharacterSheet).name !== undefined)
    && ((o as CharacterSheet).attributes !== undefined)
    && ((o as CharacterSheet).abilities !== undefined)
    && ((o as CharacterSheet).discordConfiguration !== undefined)
}