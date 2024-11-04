import { CharacterSheet } from '../../domain/common/types'

// TODO: need better validation..
// use https://www.npmjs.com/package/@sinclair/typebox + https://www.npmjs.com/package/ajv ?
export const isCharacterSheet = (o: unknown): o is CharacterSheet => {
  return (o !== null)
    && (o !== undefined)
    && ((o as CharacterSheet).id !== undefined)
    && ((o as CharacterSheet).game !== undefined)
    && ((o as CharacterSheet).name !== undefined)
    && ((o as CharacterSheet).attributes !== undefined)
    && ((o as CharacterSheet).abilities !== undefined)
    && ((o as CharacterSheet).discordNotification !== undefined)
}