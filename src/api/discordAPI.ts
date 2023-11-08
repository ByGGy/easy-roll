import { botToken } from './discordBotToken'

const baseURL = 'https://discord.com/api/v10'
const testChannelId = '1171406565434212373'

const rollDice = (max :number) => Math.round(Math.random() * max)

const createRoll = () => {
  const statValue = 50
  const modifier = 5

  const diceValue = rollDice(100)
  const isSuccess = diceValue <= statValue + modifier

  return {
      characterName: 'Anselme',
      ability: {
        name: 'Perception',
        value: statValue
      },
      value: diceValue,
      modifier: modifier,
      isSuccess
    }
}

export const createMessage = async () => {
  const roll = createRoll()
  const rollResult = `\`\`\`diff\n${roll.isSuccess ? '+' : '-'} <${roll.characterName}> ${roll.ability.name} ${roll.isSuccess ? 'success' : 'failure'} (${roll.value})\n\`\`\``
  const rollDetail = `1d100 = ${roll.value} | ${roll.ability.name}: ${roll.ability.value} | mod: ${roll.modifier >= 0 ? '+' :''}${roll.modifier}`

  const message = {
    'tts': false,
    content: rollResult,
    embeds: [{
      description: rollDetail
    }]
  }

  const response = await fetch(`${baseURL}/channels/${testChannelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': botToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message) }
  )

  return response
}
