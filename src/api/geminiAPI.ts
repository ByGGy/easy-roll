import { ChatSession, GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { GEMINI_TOKEN } from './geminiToken'

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
}

export const create = (instructions: string): ChatSession => {
  const genAI = new GoogleGenerativeAI(GEMINI_TOKEN)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: instructions })
  return model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          { text: `Hello, I'm Anselme; let's start a new story.` },
        ],
      },
    ]
  })
}

export const send = async (chat: ChatSession, request: string) => {
  const result = await chat.sendMessage(request)
  return result.response.text()
}

// const schema = {
//   description: "List of recipes",
//   type: SchemaType.ARRAY,
//   items: {
//     type: SchemaType.OBJECT,
//     properties: {
//       recipeName: {
//         type: SchemaType.STRING,
//         description: "Name of the recipe",
//         nullable: false,
//       },
//     },
//     required: ["recipeName"],
//   },
// };

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro",
//   generationConfig: {
//     responseMimeType: "application/json",
//     responseSchema: schema,
//   },
// });

// const result = await model.generateContent(
//   "List a few popular cookie recipes.",
// );
// console.log(result.response.text());