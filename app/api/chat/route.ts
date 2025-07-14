import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages, tutorId, systemPrompt } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
