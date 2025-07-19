import { NextResponse } from "next/server"

// Eleven Labs API configuration
const ELEVEN_LABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech"
// You can find available voice IDs in your Eleven Labs dashboard or API documentation.
// This is a common female voice ID.
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM" // Rachel

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json() // Language is passed but voice is fixed by ID for simplicity

    if (!text) {
      console.error("TTS API: Text is required but missing.")
      return new NextResponse("Text is required", { status: 400 })
    }

    const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY
    if (!elevenLabsApiKey) {
      console.error("ELEVEN_LABS_API_KEY is not set in environment variables.")
      return new NextResponse(
        JSON.stringify({ error: "Server configuration error: Eleven Labs API key is missing." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log(`TTS API: Requesting speech for text: "${text.substring(0, 50)}..."`)

    const response = await fetch(`${ELEVEN_LABS_API_URL}/${DEFAULT_VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2", // Or "eleven_turbo_v2" for faster, lower quality
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
      console.error("Eleven Labs API Error:", response.status, response.statusText, errorData)
      return new NextResponse(
        JSON.stringify({
          error: `Eleven Labs API failed: ${response.status} ${response.statusText} - ${errorData.message || "No message"}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Eleven Labs typically returns audio/mpeg (MP3)
    const contentType = response.headers.get("Content-Type") || "audio/mpeg"
    console.log(`TTS API: Received audio response with Content-Type: ${contentType}`)

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error) {
    console.error("TTS API Error:", error)
    return new NextResponse(
      JSON.stringify({ error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
