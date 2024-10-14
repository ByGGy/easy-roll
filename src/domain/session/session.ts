import { EntityId } from '../common/types'
import { Character } from '../character/character'
import { Repository } from '../character/repository'
import { messageBus } from '../events/messageBus'

type Session = {
  getCurrentCharacter: () => Character | null
  start: (characterId: EntityId) => void
  end: () => void
}

export const createSession = (characterRepository: Repository<Character>): Session => {
  let currentCharacter: Character | null = null

  const getCurrentCharacter = () => currentCharacter

  const start = (characterId: EntityId) => {
    const relevantCharacter = characterRepository.getById(characterId)
    if (relevantCharacter) {
      currentCharacter = relevantCharacter
      messageBus.emit('Domain.Session.start', characterId)
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