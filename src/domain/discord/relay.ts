import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { RollResult } from '../common/types'
import { Repository } from '../character/repository'
import { CharacterSheet } from '../character/characterSheet'
import { SessionState } from '../session/session'
import { StateEmitter, createState } from '../events/stateEmitter'

export type RelayState = {
  isEnabled: boolean
}

type Relay = {
  state: StateEmitter<RelayState>
  enable: () => void
  disable: () => void
}

export const createRelay = (repository: Repository<CharacterSheet>): Relay => {
  const state = createState<RelayState>({ isEnabled: false }, 'Domain.Discord')

  const enable = () => {
    state.update('isEnabled', true)
  }

  const disable = () => {
    state.update('isEnabled', false)
  }

  const maybeHandle = (handler: (...args: any[]) => void) => (...args: any[]) => {
    if (state.isEnabled)
    {
      handler(...args)
    }
  }

  const handleSessionUpdate = (previousState: SessionState, currentState: SessionState) => {
    if (currentState.character !== null) {
      const relevantCharacter = repository.getById(currentState.character.id)
      if (relevantCharacter) {
        const content = `<${relevantCharacter.name}> has entered the realm.`
        sendMessage({
          channelId: relevantCharacter.discordConfiguration.channelId,
          content
        })
      }
    } else {
      if (previousState.character !== null) {
        const relevantCharacter = repository.getById(previousState.character.id)
        if (relevantCharacter) {
          const content = `<${relevantCharacter.name}> has left the realm.`
          sendMessage({
            channelId: relevantCharacter.discordConfiguration.channelId,
            content
          })
        }
      }
    }
  }

  const handleRollResult = (roll: RollResult) => {
    const relevantCharacter = repository.getById(roll.characterId)
    if (relevantCharacter) {
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
        channelId: relevantCharacter.discordConfiguration.channelId,
        content,
        detail: details.join(' | ')
      })
    }
  }

  messageBus.on('Domain.Session.update', maybeHandle(handleSessionUpdate))

  messageBus.on('Domain.DiceTray.roll', maybeHandle(handleRollResult))
  messageBus.on('Domain.Aria.check', maybeHandle(handleRollResult))
  messageBus.on('Domain.Rdd.check', maybeHandle(handleRollResult))

  return {
    state,
    enable,
    disable
  }
}