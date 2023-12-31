import { botToken } from './discordBotToken'

const baseURL = 'https://discord.com/api/v10'
const testChannelId = '1171406565434212373'
const ariaChannelId = '418435103622955039'

export type Message = {
  content: string
  detail?: string
}

export const sendMessage = async ({ content, detail }: Message) => {
  const message = {
    'tts': false,
    content,
    embeds: detail ? [{
      description: detail
    }] : []
  }

  const response = await fetch(`${baseURL}/channels/${ariaChannelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': botToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message) }
  )

  return response
}
