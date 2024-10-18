import { messageBus } from '../events/messageBus'
import { sendMessage } from '../../api/discordAPI'
import { EntityId } from '../common/types'
import { DiceTrayRoll } from '../dicetray/engine'
import { RollCheck as AriaRollCheck } from '../aria/engine'
import { RollCheck as RddRollCheck } from '../rdd/engine'
import { Repository } from '../character/repository'
import { CharacterSheet } from '../character/characterSheet'

export const createRelay = (repository: Repository<CharacterSheet>) => {

  const handleSessionStart = (characterId: EntityId) => {
    const relevantCharacter = repository.getById(characterId)
    if (relevantCharacter) {
      const content = `<${relevantCharacter.name}> has entered the realm.`
      sendMessage({
        channelId: relevantCharacter.discordConfiguration.channelId,
        content
      })
    }
  }

  const handleSessionEnd = (characterId: EntityId) => {
    const relevantCharacter = repository.getById(characterId)
    if (relevantCharacter) {
      const content = `<${relevantCharacter.name}> has left the realm.`
      sendMessage({
        channelId: relevantCharacter.discordConfiguration.channelId,
        content
      })
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

  messageBus.on('Domain.Session.start', handleSessionStart)
  messageBus.on('Domain.Session.end', handleSessionEnd)

  messageBus.on('Domain.DiceTray.roll', handleDiceTrayRoll)
  messageBus.on('Domain.Aria.check', handleAriaCheck)
  messageBus.on('Domain.Rdd.check', handleRddCheck)

  return {}
}