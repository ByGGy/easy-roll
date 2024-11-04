import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { CharacterSheet, RollResult } from '../common/types'
import { Repository } from '../../persistence/character/repository'
import { SessionState } from '../session/session'

export const createRelay = (repository: Repository<CharacterSheet>) => {

  const handleSessionUpdate = (previousState: SessionState, currentState: SessionState) => {
    if (currentState.characterId !== null) {
      const relevantCharacter = repository.getById(currentState.characterId)
      if (relevantCharacter && relevantCharacter.discordNotification.enable) {
        const content = `<${relevantCharacter.name}> has entered the realm.`
        sendMessage({
          channelId: relevantCharacter.discordNotification.channelId,
          content
        })
      }
    } else {
      if (previousState.characterId !== null) {
        const relevantCharacter = repository.getById(previousState.characterId)
        if (relevantCharacter && relevantCharacter.discordNotification.enable) {
          const content = `<${relevantCharacter.name}> has left the realm.`
          sendMessage({
            channelId: relevantCharacter.discordNotification.channelId,
            content
          })
        }
      }
    }
  }

  const handleRollResult = (roll: RollResult) => {
    const relevantCharacter = repository.getById(roll.characterId)
    if (relevantCharacter && relevantCharacter.discordNotification.enable) {
      let content = ''
      if (roll.checkDetails !== null) {
        const isSuccess = roll.diceDetails.total <= roll.checkDetails.successThreshold
        const baseFactors = roll.checkDetails.factors.filter(f => f.type === 'base').map(f => f.name).join(' + ')
        content = `\`\`\`diff\n${isSuccess ? '+' : '-'} <${relevantCharacter.name}> ${baseFactors} : ${isSuccess ? 'success' : 'failure'} (${roll.diceDetails.total})\n\`\`\``
      } else {
        content = `<${relevantCharacter.name}> got \`${roll.diceDetails.total}\` on his roll.`
      }
      
      const details = []
      details.push(`${roll.diceDetails.diceQty}d${roll.diceDetails.diceFaceQty} = ${roll.diceDetails.rolls.join(', ')}`)
      if (roll.diceDetails.modifier !== 0) {
        details.push(`modifier: ${roll.diceDetails.modifier > 0 ? '+' :''}${roll.diceDetails.modifier}`)
      }
      if (roll.checkDetails !== null) {
        roll.checkDetails.factors.forEach(f => {
          switch (f.type) {
            case 'base':
              details.push(`${f.name}: ${f.value}`)
              break

            case 'multiplier':
              details.push(`${f.name}: x${f.value}`)
              break

            case 'offset':
              details.push(`${f.name}: ${f.value > 0 ? '+' :''}${f.value}`)
              break
          }
        })

        details.push(`threshold: ${roll.checkDetails.successThreshold}`)
      }

      sendMessage({
        channelId: relevantCharacter.discordNotification.channelId,
        content,
        detail: details.join(' | ')
      })
    }
  }

  messageBus.on('Domain.Session.update', handleSessionUpdate)

  messageBus.on('Domain.DiceTray.roll', handleRollResult)
  messageBus.on('Domain.Aria.check', handleRollResult)
  messageBus.on('Domain.Rdd.check', handleRollResult)

  return {}
}