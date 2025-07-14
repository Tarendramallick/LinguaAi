"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { AnimatedCharacter } from "@/components/animated-character"
import { ArrowLeft, Volume2, Globe, Mic, MicOff, Settings } from "lucide-react"
import Link from "next/link"
import { VoiceControls } from "@/components/voice-controls"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "instruction",
        role: "assistant",
        content: "Click the microphone button to start your conversation!",
      },
    ],
    body: {
      tutorId: tutor.id,
      systemPrompt: tutor.systemPrompt,
    },
  })

  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // characterStyle is now fixed to "realistic" (video)
  const characterStyle = "realistic"

  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 1.1, // Pitch and rate will be handled by TTS service, but kept for potential future use
    volume: 0.8,
    autoSpeak: true,
  })
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [currentEmotion, setCurrentEmotion] = useState<"neutral" | "thinking" | "happy" | "surprised" | "encouraging">(
    "neutral",
  )
  const [hasUserInitiatedAudio, setHasUserInitiatedAudio] = useState(false)

  // Function to play speech using external TTS
  const handleSpeech = async (text: string) => {
    if (!speechEnabled) {
      console.warn("Speech is disabled by user settings.")
      return
    }

    setIsCharacterSpeaking(true)
    setCurrentEmotion("happy") // Assume speaking is generally happy/encouraging

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, language: tutor.language.toLowerCase().substring(0, 2) }),
      })

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setCurrentAudioUrl(url)

      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.volume = voiceSettings.volume // Apply volume setting
        audioRef.current.play().catch((e) => {
          console.error("Audio playback failed:", e)
          alert(
            "Audio playback failed. This might be due to browser autoplay policies. Please ensure your system volume is up.",
          )
          setIsCharacterSpeaking(false)
          setCurrentEmotion("neutral")
        })
      }
    } catch (error) {
      console.error("Error generating or playing speech:", error)
      alert(
        "Failed to generate speech. Please check your internet connection or try refreshing the page. If the issue persists, the TTS service might be unavailable.",
      )
      setIsCharacterSpeaking(false)
      setCurrentEmotion("neutral")
    }
  }

  // Effect to handle auto-speaking for subsequent messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      !isLoading &&
      voiceSettings.autoSpeak &&
      speechEnabled &&
      hasUserInitiatedAudio && // Only auto-play after user interaction
      lastMessage.id !== "instruction" // Don't auto-play the initial instruction message
    ) {
      setTimeout(() => {
        handleSpeech(lastMessage.content)
      }, 500)
    }
  }, [messages, isLoading, voiceSettings.autoSpeak, speechEnabled, hasUserInitiatedAudio])

  // Effect to manage emotion based on chat state
  useEffect(() => {
    if (isLoading) {
      setCurrentEmotion("thinking")
    } else if (isCharacterSpeaking) {
      // Emotion is set in handleSpeech for speaking
    } else {
      setCurrentEmotion("neutral")
    }
  }, [isLoading, isCharacterSpeaking])

  // Function to handle user's microphone input
  const handleMicInput = () => {
    if (!hasUserInitiatedAudio) {
      setHasUserInitiatedAudio(true)
      // Replace the initial instruction message with the actual greeting
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: initialGreetingContent,
        },
      ])
      handleSpeech(initialGreetingContent)
      return // Do not submit a user message for this initial "click to start"
    }

    // For subsequent clicks, simulate sending a voice input
    const userMessage = `User spoke something in ${tutor.nativeLanguage || "their native language"}.`
    // Add user's simulated message to the chat history
    setMessages((prevMessages) => [...prevMessages, { id: Date.now().toString(), role: "user", content: userMessage }])

    setCurrentEmotion("thinking")
    // Trigger the AI's response via useChat's handleSubmit
    handleSubmit({
      preventDefault: () => {}, // Mock preventDefault
      target: { value: userMessage }, // Mock event target for useChat
    } as React.FormEvent<HTMLFormElement>)

    // Simulate a short listening duration before resetting emotion
    setTimeout(() => {
      setCurrentEmotion("neutral")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onPlay={() => setIsCharacterSpeaking(true)}
        onEnded={() => {
          setIsCharacterSpeaking(false)
          setCurrentEmotion("neutral")
          if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl) // Clean up the object URL
            setCurrentAudioUrl(null)
          }
        }}
        onError={(e) => {
          console.error("Audio element error:", e)
          setIsCharacterSpeaking(false)
          setCurrentEmotion("neutral")
          alert("Audio playback failed. Please check your internet connection or system volume.")
          if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl)
            setCurrentAudioUrl(null)
          }
        }}
      />

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
        {/* AI Tutor's "Video Feed" - The Animated Character (now directly the video) */}
        <div className="w-full max-w-md h-64 md:h-80 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center relative mb-8 shadow-xl">
          <AnimatedCharacter
            avatar={tutor.avatar}
            isActive={isLoading}
            color={tutor.accent}
            name={tutor.name}
            isSpeaking={isCharacterSpeaking}
            tutorId={tutor.id}
            characterStyle={characterStyle} // This is now fixed to "realistic"
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
            ) : (
              <Mic className={`w-10 h-10 ${isCharacterSpeaking ? "animate-pulse" : ""}`} />
            )}
          </Button>
          <p className="text-sm text-gray-600 mt-2">Click to speak</p>
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
