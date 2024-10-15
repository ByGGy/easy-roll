import { EntityId } from '../common/types'
import { CharacterSheet } from '../character/characterSheet'
import { Repository } from '../character/repository'
import { messageBus } from '../events/messageBus'

type Session = {
  getCurrentCharacter: () => CharacterSheet | null
  start: (characterId: EntityId) => void
  end: () => void
}

export const createSession = (repository: Repository<CharacterSheet>): Session => {
  let currentCharacter: CharacterSheet | null = null

  const getCurrentCharacter = () => currentCharacter

  const start = (characterId: EntityId) => {
    const relevantCharacter = repository.getById(characterId)
    if (relevantCharacter) {
      currentCharacter = relevantCharacter
      messageBus.emit('Domain.Session.start', currentCharacter.id)
    }
  }

  const end = () => {
    if (currentCharacter !== null) {
      messageBus.emit('Domain.Session.end', currentCharacter.id)
      currentCharacter = null  
    }
  }

  return {
    getCurrentCharacter,
    start,
    end
  }
}