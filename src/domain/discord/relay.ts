import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { Character, EntityId, RollCheck } from '../character/character'
import { Repository } from '../character/repository'

export const createRelay = (characterRepository: Repository<Character>) => {

  const handleSessionStart = (characterId: EntityId) => {
    const relevantCharacter = characterRepository.getById(characterId)
    if (relevantCharacter) {
      const content = `<${relevantCharacter.name}> has entered the realm.`
      sendMessage({ content })
    }
  }

  const handleSessionEnd = (characterId: EntityId) => {
    const relevantCharacter = characterRepository.getById(characterId)
    if (relevantCharacter) {
      const content = `<${relevantCharacter.name}> has left the realm.`
      sendMessage({ content })
    }
  }

  const handleCharacterAttempt = (roll: RollCheck) => {
    const relevantCharacter = characterRepository.getById(roll.characterId)
    if (relevantCharacter) {
      const rollResult = `\`\`\`diff\n${roll.isSuccess ? '+' : '-'} <${relevantCharacter.name}> ${roll.statName} ${roll.isSuccess ? 'success' : 'failure'} (${roll.value})\n\`\`\``
      const relevantAbility = relevantCharacter.abilities.find((a) => a.name === roll.statName)
      let rollDetail = ''
      if (relevantAbility) {
        rollDetail = `1d100 = ${roll.value} | ${roll.statName}: ${relevantAbility.value} | mod: ${roll.modifier >= 0 ? '+' :''}${roll.modifier}`
      }
      sendMessage({
        content: rollResult,
        detail: rollDetail
      })
    }
  }

  messageBus.on('Domain.Session.start', handleSessionStart)
  messageBus.on('Domain.Session.end', handleSessionEnd)

  messageBus.on('Domain.Character.attempt', handleCharacterAttempt)

  return {}
}