"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AnimatedCharacter } from "@/components/animated-character"
import { ArrowLeft, Volume2, Globe, Mic, MicOff, Settings } from "lucide-react"
import Link from "next/link"
import { VoiceControls } from "@/components/voice-controls"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Declare SpeechRecognition and webkitSpeechRecognition globally for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

interface Tutor {
  id: string
  name: string
  language: string
  nativeLanguage?: string
  specialty: string
  personality: string
  avatar: string
  color: string
  accent: string
  systemPrompt: string
}

interface ChatInterfaceProps {
  tutor: Tutor
}

export function ChatInterface({ tutor }: ChatInterfaceProps) {
  const initialGreetingContent = `Hello! I'm Ava, your AI language tutor! I understand you speak ${tutor.nativeLanguage} and want to learn ${tutor.language}. I'm here to help you learn naturally through conversation. Let's start with something simple - tell me a bit about yourself and why you want to learn ${tutor.language}!`

  // Simple state management instead of useChat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "instruction",
      role: "assistant",
      content: "Click the microphone button to start your conversation!",
      createdAt: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null) // Ref for SpeechRecognition
  const [isListening, setIsListening] = useState(false) // State for mic listening status

  // characterStyle is now fixed to "realistic" (video)
  const characterStyle = "realistic"

  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8,
    autoSpeak: true,
  })
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [currentEmotion, setCurrentEmotion] = useState<"neutral" | "thinking" | "happy" | "surprised" | "encouraging">(
    "neutral",
  )
  const [hasUserInitiatedAudio, setHasUserInitiatedAudio] = useState(false)

  // Function to send message to AI
  const sendMessageToAI = async (userMessage: string) => {
    console.log("sendMessageToAI: Sending message:", userMessage)
    setIsLoading(true)
    setError(null)

    try {
      // Add user message to chat
      const userMessageObj: Message = {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        createdAt: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, userMessageObj])

      // Make API call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessageObj],
          tutorId: tutor.id,
          systemPrompt: tutor.systemPrompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `API responded with ${response.status}`)
      }

      const data = await response.json()
      console.log("sendMessageToAI: Received response:", data)

      if (data.success && data.message) {
        // Add AI response to messages
        const aiMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          createdAt: new Date(),
        }

        setMessages((prevMessages) => [...prevMessages, aiMessageObj])
        console.log("sendMessageToAI: AI response added to chat:", data.message.substring(0, 50) + "...")

        // Trigger TTS for the response
        if (voiceSettings.autoSpeak && speechEnabled && hasUserInitiatedAudio) {
          setTimeout(() => {
            handleSpeech(data.message)
          }, 500)
        }
      } else {
        throw new Error("Invalid response format from API")
      }
    } catch (error) {
      console.error("sendMessageToAI: Error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(errorMessage)
      alert(`Failed to get AI response: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang =
        tutor.nativeLanguage === "en"
          ? "en-US"
          : tutor.nativeLanguage === "es"
            ? "es-ES"
            : tutor.nativeLanguage || "en-US"

      recognition.onstart = () => {
        setIsListening(true)
        setCurrentEmotion("thinking")
        console.log("SpeechRecognition: Listening started.")
      }

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript
        console.log("SpeechRecognition: Transcript received:", transcript)
        setIsListening(false)
        setCurrentEmotion("neutral")

        // Send message to AI
        await sendMessageToAI(transcript)
      }

      recognition.onerror = (event) => {
        console.error("SpeechRecognition: Error occurred:", event.error)
        setIsListening(false)
        setCurrentEmotion("neutral")
        if (event.error === "not-allowed") {
          alert(
            "Microphone access denied. Please allow microphone permissions in your browser settings to use voice input.",
          )
        } else if (event.error === "no-speech") {
          console.warn("SpeechRecognition: No speech detected. Please try again.")
        } else if (event.error === "network") {
          alert(
            "Speech recognition network error. Please check your internet connection and try again. Sometimes, restarting your browser helps.",
          )
        } else {
          alert(`Speech recognition error: ${event.error}. Please try again.`)
        }
      }

      recognition.onend = () => {
        console.log("SpeechRecognition: Listening ended.")
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      console.warn("Web Speech API not supported in this browser.")
      alert("Your browser does not support Web Speech API for voice input.")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [
    tutor.nativeLanguage,
    tutor.id,
    tutor.systemPrompt,
    messages,
    voiceSettings.autoSpeak,
    speechEnabled,
    hasUserInitiatedAudio,
  ])

  // Function to play speech using external TTS
  const handleSpeech = async (text: string) => {
    if (!speechEnabled) {
      console.warn("handleSpeech: Speech is disabled by user settings.")
      return
    }

    console.log("handleSpeech: Attempting to fetch TTS for text:", text.substring(0, 50) + "...")
    setIsCharacterSpeaking(true)
    setCurrentEmotion("happy")

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, language: tutor.language.toLowerCase().substring(0, 2) }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: "No error message from server." }))
        throw new Error(
          `TTS API error: ${response.status} ${response.statusText} - ${errorBody.error || errorBody.message}`,
        )
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("audio")) {
        throw new Error(`Invalid response format - expected audio, got ${contentType}`)
      }

      const blob = await response.blob()
      console.log("handleSpeech: Received audio blob. Type:", blob.type, "Size:", blob.size, "bytes")

      if (blob.size === 0) {
        console.warn("handleSpeech: Received empty audio response. Skipping playback.")
        setIsCharacterSpeaking(false)
        setCurrentEmotion("neutral")
        return
      }

      const url = URL.createObjectURL(blob)
      setCurrentAudioUrl(url)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = url
        audioRef.current.volume = voiceSettings.volume

        const playAudio = () => {
          if (audioRef.current) {
            console.log("handleSpeech: Attempting audioRef.current.play()")
            audioRef.current.play().catch((e) => {
              console.error("handleSpeech: Audio playback failed:", e)
              setIsCharacterSpeaking(false)
              setCurrentEmotion("neutral")
              if (url) {
                URL.revokeObjectURL(url)
                setCurrentAudioUrl(null)
              }
            })
          }
        }

        audioRef.current.addEventListener("loadeddata", playAudio, { once: true })
        audioRef.current.load()
        console.log("handleSpeech: Audio load triggered.")
      }
    } catch (error) {
      console.error("handleSpeech: Error generating or playing speech:", error)
      setIsCharacterSpeaking(false)
      setCurrentEmotion("neutral")
    }
  }

  // Effect to manage emotion based on chat state
  useEffect(() => {
    if (isLoading) {
      setCurrentEmotion("thinking")
    } else if (isCharacterSpeaking) {
      // Emotion is set in handleSpeech for speaking
    } else if (isListening) {
      setCurrentEmotion("thinking")
    } else {
      setCurrentEmotion("neutral")
    }
  }, [isLoading, isCharacterSpeaking, isListening])

  // Function to handle user's microphone input
  const handleMicInput = () => {
    console.log("handleMicInput: Mic button clicked.")

    if (isLoading || isCharacterSpeaking) {
      console.log("handleMicInput: Button disabled due to AI thinking or speaking.")
      return
    }

    if (!hasUserInitiatedAudio) {
      setHasUserInitiatedAudio(true)
      // Replace the initial instruction message with the actual greeting
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: initialGreetingContent,
          createdAt: new Date(),
        },
      ])
      console.log("handleMicInput: Initiating first greeting and speech directly.")
      handleSpeech(initialGreetingContent)
      return
    }

    // For subsequent clicks, toggle speech recognition
    if (recognitionRef.current) {
      if (isListening) {
        console.log("handleMicInput: Stopping speech recognition.")
        recognitionRef.current.stop()
      } else {
        console.log("handleMicInput: Starting speech recognition.")
        try {
          recognitionRef.current.start()
        } catch (e) {
          console.error("SpeechRecognition: Failed to start:", e)
          alert("Failed to start microphone. Please ensure no other application is using it.")
          setIsListening(false)
        }
      }
    } else {
      console.warn("SpeechRecognition not initialized or supported.")
      alert("Voice input is not supported in your browser or failed to initialize.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onPlay={() => {
          console.log("Audio element: Playback started.")
          setIsCharacterSpeaking(true)
        }}
        onEnded={() => {
          console.log("Audio element: Playback finished.")
          setIsCharacterSpeaking(false)
          setCurrentEmotion("neutral")
          if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl)
            setCurrentAudioUrl(null)
          }
        }}
        onError={(e) => {
          console.error("Audio element: Error occurred:", e.currentTarget.error)
          setIsCharacterSpeaking(false)
          setCurrentEmotion("neutral")
          if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl)
            setCurrentAudioUrl(null)
          }
        }}
      />

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong className="font-bold">Chat Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Header with Settings Icon */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">{tutor.avatar}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tutor.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>
                  Learning {tutor.language} from {tutor.nativeLanguage}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-transparent">
              <Settings className="w-5 h-5" />
              <span className="sr-only">Open settings</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-80 sm:w-96">
            <SheetHeader>
              <SheetTitle>Voice Settings</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <VoiceControls onSpeechToggle={setSpeechEnabled} onVoiceSettingsChange={setVoiceSettings} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Video Call Interface */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl h-[calc(100vh-180px)] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg p-6 relative">
        {/* AI Tutor's "Video Feed" */}
        <div className="w-full max-w-md h-64 md:h-80 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center relative mb-8 shadow-xl">
          <AnimatedCharacter
            avatar={tutor.avatar}
            isActive={isLoading}
            color={tutor.accent}
            name={tutor.name}
            isSpeaking={isCharacterSpeaking}
            isListening={isListening}
            tutorId={tutor.id}
            characterStyle={characterStyle}
            emotion={currentEmotion}
          />
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
          {isCharacterSpeaking && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-gray-800 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Speaking...</span>
            </div>
          )}
        </div>

        {/* User's "Microphone" Control */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            {messages[0]?.id === "instruction"
              ? "Click the mic to start conversation!"
              : isLoading
                ? "AI is thinking..."
                : isCharacterSpeaking
                  ? "AI is speaking..."
                  : isListening
                    ? "Listening..."
                    : "Ready to talk!"}
          </p>
          <Button
            onClick={handleMicInput}
            disabled={isLoading || isCharacterSpeaking}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300
            ${isLoading || isCharacterSpeaking ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"}
            ${isLoading ? "animate-pulse" : ""}
          `}
          >
            {isLoading ? (
              <MicOff className="w-10 h-10" />
            ) : isListening ? (
              <Mic className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </Button>
          <p className="text-sm text-gray-600 mt-2">{isListening ? "Click to stop speaking" : "Click to speak"}</p>
          {!hasUserInitiatedAudio && <p className="text-xs text-gray-500 mt-1">(Ensure your system volume is up!)</p>}
        </div>

        {/* User's Video Stream Placeholder */}
        <div className="absolute bottom-6 right-6 w-32 h-24 bg-gray-700 rounded-lg shadow-lg overflow-hidden border-2 border-white flex items-center justify-center text-white text-xs">
          Your Video
          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">You</div>
        </div>
      </div>
    </div>
  )
}
