import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { DiceTrayRoll } from '../dicetray/engine'
import { RollCheck as AriaRollCheck } from '../aria/engine'
import { RollCheck as RddRollCheck } from '../rdd/engine'
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

  const handleDiceTrayRoll = (roll: DiceTrayRoll) => {
    const relevantCharacter = repository.getById(roll.characterId)
    if (relevantCharacter) {
      const rollResult = `<${relevantCharacter.name}> got \`${roll.total}\` on his roll.`
      
      const details = []
      details.push(`${roll.diceQty}d${roll.diceFaceQty} = ${roll.rolls.join(', ')}`)
      details.push(`mod: ${roll.modifier > 0 ? '+' :''}${roll.modifier}`)

      sendMessage({
        channelId: relevantCharacter.discordConfiguration.channelId,
        content: rollResult,
        detail: details.join(' | ')
      })
    }
  }

  const handleAriaCheck = (roll: AriaRollCheck) => {
    const relevantCharacter = repository.getById(roll.characterId)
    if (relevantCharacter) {
      const rollResult = `\`\`\`diff\n${roll.isSuccess ? '+' : '-'} <${relevantCharacter.name}> ${roll.statName} : ${roll.isSuccess ? 'success' : 'failure'} (${roll.value})\n\`\`\``
      
      const details = []
      details.push(`1d100 = ${roll.value}`)
      details.push(`${roll.statName}: ${roll.statValue}`)
      if (roll.difficulty) {
        details.push(`difficulty: x${roll.difficulty}`)
      }
      details.push(`mod: ${roll.modifier > 0 ? '+' :''}${roll.modifier}`)
      details.push(`threshold: ${roll.threshold}`)

      sendMessage({
        channelId: relevantCharacter.discordConfiguration.channelId,
        content: rollResult,
        detail: details.join(' | ')
      })
    }
  }

  const handleRddCheck = (roll: RddRollCheck) => {
    const relevantCharacter = repository.getById(roll.characterId)
    if (relevantCharacter) {
      const rollResult = `\`\`\`diff\n${roll.isSuccess ? '+' : '-'} <${relevantCharacter.name}> ${roll.attributeName}${roll.abilityName ? ` + ${roll.abilityName}`: ''} : ${roll.isSuccess ? 'success' : 'failure'} (${roll.value})\n\`\`\``
      
      const details = []
      details.push(`1d100 = ${roll.value}`)
      details.push(`${roll.attributeName}: ${roll.attributeValue}`)
      if (roll.abilityName) {
        details.push(`${roll.abilityName}: ${roll.abilityValue}`)
      }
      details.push(`mod: ${roll.modifier > 0 ? '+' :''}${roll.modifier}`)
      details.push(`threshold: ${roll.threshold}`)

      sendMessage({
        channelId: relevantCharacter.discordConfiguration.channelId,
        content: rollResult,
        detail: details.join(' | ')
      })
    }
  }

  messageBus.on('Domain.Session.update', maybeHandle(handleSessionUpdate))

  messageBus.on('Domain.DiceTray.roll', maybeHandle(handleDiceTrayRoll))
  messageBus.on('Domain.Aria.check', maybeHandle(handleAriaCheck))
  messageBus.on('Domain.Rdd.check', maybeHandle(handleRddCheck))

  return {
    state,
    enable,
    disable
  }
}