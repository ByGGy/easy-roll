import { DISCORD_TOKEN } from './discordBotToken'

const baseURL = 'https://discord.com/api/v10'

export type Message = {
  channelId: string
  content: string
  detail?: string
}

// TODO: throw / catch and store in log files (or display notifications in UI)
export const sendMessage = async ({ channelId, content, detail }: Message) => {
  const message = {
    'tts': false,
    content,
    embeds: detail ? [{
      description: detail
    }] : []
  }

  const response = await fetch(`${baseURL}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': DISCORD_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message) }
  )

  return response
}
