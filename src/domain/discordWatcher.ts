import { messageBus } from './messageBus'
import { sendMessage } from '../api/discordAPI'
import { Character, RollCheck } from './character'

export const createWatcher = (character: Character) => {
  const handleCharacterAttempt = (roll: RollCheck) => {
    const rollResult = `\`\`\`diff\n${roll.isSuccess ? '+' : '-'} <${character.name}> ${roll.statName} ${roll.isSuccess ? 'success' : 'failure'} (${roll.value})\n\`\`\``
    const rollDetail = `1d100 = ${roll.value} | ${roll.statName}: ${character.abilities.find((a) => a.name === roll.statName).value} | mod: ${roll.modifier >= 0 ? '+' :''}${roll.modifier}`
    sendMessage({
      content: rollResult,
      detail: rollDetail
    })
  }

  messageBus.on('Character.attempt', handleCharacterAttempt)

  return {}
}