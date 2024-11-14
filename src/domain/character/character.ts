import { randomUUID } from 'crypto'
import { EntityId, EntityWithState, Attribute, Ability, DiscordNotification } from '../common/types'
import { createState } from '../events/stateEmitter'

// TODO: should have a creation date ?
// TODO: should allow to assign tags, like Hero | Villain | PNJ | Monster
export type CharacterState = {
  name: string
  tags: Array<string>
  attributes: Array<Attribute>
  abilities: Array<Ability>
  discordNotification: DiscordNotification
}

export type CharacterData = EntityWithState<CharacterState>

export type Character = CharacterData & {
  rename: (newName: string) => void
  changeAttributes: (newAttributes: Array<Attribute>) => void
  changeAbilities: (newAbilities: Array<Ability>) => void
  changeDiscordConfiguration: (newConfiguration: DiscordNotification) => void
}

// TODO: if the exposed state was StateEmitter, we could call .update directly without relying on pass-through functions
// might be better to keep those functions for local transformation / validation though ? 
const createModel = (id: EntityId, state: CharacterState): Character => {
  const emitterState = createState<CharacterState>({...state}, id, 'Domain.Character')
  
  const rename = (newName: string) => {
    emitterState.update('name', newName)
  }

  const changeAttributes = (newAttributes: Array<Attribute>) => {
    emitterState.update('attributes', newAttributes)
  }

  const changeAbilities = (newAbilities: Array<Ability>) => {
    emitterState.update('abilities', newAbilities)
  }

  const changeDiscordConfiguration = (newConfiguration: DiscordNotification) => {
    emitterState.update('discordNotification', newConfiguration)
  }

  return {
    id,
    state: emitterState,
    rename,
    changeAttributes,
    changeAbilities,
    changeDiscordConfiguration
  }
}

export const rehydrate = (data: CharacterData): Character => {
  return createModel(data.id, data.state)
}

export const create = (initialState: CharacterState): Character => {
  return createModel(randomUUID(), initialState)
}