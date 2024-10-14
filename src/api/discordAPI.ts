import { botToken } from './discordBotToken'

const baseURL = 'https://discord.com/api/v10'
const test_ariaChannelId = '1171406565434212373'
const test_rddChannelId = '1295362513784803449'
const ariaChannelId = '418435103622955039'
const rddChannelId = '1157440787265634364'

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

  const response = await fetch(`${baseURL}/channels/${test_rddChannelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': botToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message) }
  )

  return response
}
