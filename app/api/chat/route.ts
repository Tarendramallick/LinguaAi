import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  console.log("API/Chat: Request received.")
  try {
    const body = await req.json()
    console.log("API/Chat: Request body received")

    const { messages, tutorId, systemPrompt } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("API/Chat: Invalid or empty messages array received.")
      return Response.json({ error: "Invalid or empty messages array provided." }, { status: 400 })
    }

    console.log("API/Chat: Received messages count:", messages.length)
    console.log("API/Chat: Last user message:", messages[messages.length - 1]?.content?.substring(0, 100) + "...")

    // Check for API Key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not set in environment variables.")
      return Response.json({ error: "Server configuration error: OpenAI API key is missing." }, { status: 500 })
    }

    console.log("API/Chat: Calling OpenAI with model gpt-4o...")

    // Ensure we have a proper system prompt
    const finalSystemPrompt =
      systemPrompt || `You are Ava, a helpful AI language tutor. Be encouraging and supportive in your responses.`

    // Use generateText instead of streamText for simplicity and reliability
    const result = await generateText({
      model: openai("gpt-4o"),
      system: finalSystemPrompt,
      messages: messages,
      maxTokens: 500,
      temperature: 0.7,
    })

    console.log("API/Chat: OpenAI response received:", result.text.substring(0, 100) + "...")

    // Return a simple JSON response instead of streaming
    return Response.json({
      success: true,
      message: result.text,
      usage: result.usage,
    })
  } catch (error) {
    console.error("API/Chat: Error in chat route catch block:", error)

    let errorMessage = "An unexpected error occurred."
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      console.error("API/Chat: Detailed error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      if (errorMessage.includes("API key")) {
        errorMessage = "OpenAI API key is invalid or missing."
        statusCode = 401
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "OpenAI API rate limit exceeded. Please try again later."
        statusCode = 429
      } else if (errorMessage.includes("quota")) {
        errorMessage = "OpenAI API quota exceeded. Please check your billing."
        statusCode = 402
      }
    }

    return Response.json({ error: `Failed to get AI response: ${errorMessage}` }, { status: statusCode })
  }
}
