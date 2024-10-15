import { Entity, Nominal } from '../common/types'

export type Attribute = Nominal<'Attribute', Readonly<{
  name: string,
  value: number
}>>

export type Ability = Nominal<'Ability', Readonly<{
  name: string,
  value: number
}>>

export type CharacterSheet = Entity & Readonly<{
  name: string
  attributes: Array<Attribute>
  abilities: Array<Ability>
}>

// TODO: need better validation..
export const isCharacterSheet = (o: unknown): o is CharacterSheet => {
  return (o !== null) && (o !== undefined) && ((o as CharacterSheet).id !== undefined) && ((o as CharacterSheet).name !== undefined) && ((o as CharacterSheet).attributes !== undefined) && ((o as CharacterSheet).abilities !== undefined)
}