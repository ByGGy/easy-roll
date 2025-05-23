import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { EntityId, RollResult } from '../common/types'
import { Repository } from '../../persistence/common/repository'
import { Character, CharacterState } from '../character/character'
import { SessionState } from '../session/session'
import { unreachable } from '../common/tools'

export const createRelay = (repository: Repository<Character, CharacterState>) => {

  const handleSessionUpdate = (_: EntityId, previousState: SessionState, currentState: SessionState) => {
    // if (currentState.characterId !== null) {
    //   const relevantCharacter = repository.getById(currentState.characterId)
    //   if (relevantCharacter && relevantCharacter.state.discordNotification.enable) {
    //     const content = `<${relevantCharacter.state.name}> has entered the realm.`
    //     sendMessage({
    //       channelId: relevantCharacter.state.discordNotification.channelId,
    //       content
    //     })
    //   }
    // } else {
    //   if (previousState.characterId !== null) {
    //     const relevantCharacter = repository.getById(previousState.characterId)
    //     if (relevantCharacter && relevantCharacter.state.discordNotification.enable) {
    //       const content = `<${relevantCharacter.state.name}> has left the realm.`
    //       sendMessage({
    //         channelId: relevantCharacter.state.discordNotification.channelId,
    //         content
    //       })
    //     }
    //   }
    // }
  }

  const handleRollResult = (roll: RollResult) => {
    const relevantCharacter = repository.getById(roll.characterId)
    if (relevantCharacter && relevantCharacter.state.discordNotification.enable) {
      let content = ''
      const displayedRollValue = relevantCharacter.state.discordNotification.level === 'Strict' ? '**' : `${roll.diceDetails.total}`
      if (roll.checkDetails !== null) {
        content = `\`\`\`diff\n${roll.checkDetails.isSuccess ? '+' : '-'} <${relevantCharacter.state.name}> ${roll.title} : ${roll.checkDetails.isSuccess ? 'success' : 'failure'} (${displayedRollValue})\n\`\`\``
      } else {
        content = `<${relevantCharacter.state.name}> got \`${displayedRollValue}\` on his roll.`
      }
      
      const details = []
      if (relevantCharacter.state.discordNotification.level === 'Verbose') {
        roll.diceDetails.groups.forEach(g => {
          details.push(`${g.diceQty}d${g.diceFaceQty} = ${g.rolls.join(', ')}`)  
        })
        
        if (roll.checkDetails !== null) {
          roll.checkDetails.factors.forEach(f => {
            switch (f.type) {
              default:
                unreachable(f.type)
                break

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
        } else {
          details.push(`${roll.title}= ${roll.diceDetails.total}`)
        }
      }

      sendMessage({
        channelId: relevantCharacter.state.discordNotification.channelId,
        content,
        detail: details.join(' | ')
      })
    }
  }

  messageBus.on('Domain.Session.update', handleSessionUpdate)

  messageBus.on('Domain.DiceTray.roll', handleRollResult)
  messageBus.on('Domain.Aria.check', handleRollResult)
  messageBus.on('Domain.Rdd.check', handleRollResult)
  messageBus.on('Domain.Basic.check', handleRollResult)

  return {}
}