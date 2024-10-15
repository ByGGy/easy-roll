import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { EntityId } from '../common/types'
// import { Character, RollCheck } from '../character/character'
import { Repository } from '../character/repository'
import { CharacterSheet } from '../character/characterSheet'

export const createRelay = (repository: Repository<CharacterSheet>) => {

  const handleSessionStart = (characterId: EntityId) => {
    const relevantCharacter = repository.getById(characterId)
    if (relevantCharacter) {
      const content = `<${relevantCharacter.name}> has entered the realm.`
      sendMessage({ content })
    }
  }

  const handleSessionEnd = (characterId: EntityId) => {
    const relevantCharacter = repository.getById(characterId)
    if (relevantCharacter) {
      const content = `<${relevantCharacter.name}> has left the realm.`
      sendMessage({ content })
    }
  }

  // const handleCharacterCheck = (roll: RollCheck) => {
  //   const relevantCharacter = characterRepository.getById(roll.characterId)
  //   if (relevantCharacter) {
  //     const rollResult = `\`\`\`diff\n${roll.isSuccess ? '+' : '-'} <${relevantCharacter.sheet.name}> ${roll.statName} : ${roll.isSuccess ? 'success' : 'failure'} (${roll.value})\n\`\`\``
      
  //     const details = []
  //     details.push(`1d100 = ${roll.value}`)
  //     details.push(`${roll.statName}: ${roll.statValue}`)
  //     if (roll.difficulty) {
  //       details.push(`difficulty: x${roll.difficulty}`)
  //     }
  //     details.push(`mod: ${roll.modifier >= 0 ? '+' :''}${roll.modifier}`)

  //     sendMessage({
  //       content: rollResult,
  //       detail: details.join(' | ')
  //     })
  //   }
  // }

  messageBus.on('Domain.Session.start', handleSessionStart)
  messageBus.on('Domain.Session.end', handleSessionEnd)

  // messageBus.on('Domain.Character.check', handleCharacterCheck)

  return {}
}