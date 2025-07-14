"use client"
// import { Canvas, useFrame } from "@react-three/fiber"
// import { OrbitControls, Environment, PerspectiveCamera, Html } from "@react-three/drei"
// import type * as THREE from "three"

interface Anime3DCharacterProps {
  tutorId: string
  isActive: boolean
  isSpeaking: boolean
  tutorColor: string
  tutorName: string
  emotion: "neutral" | "thinking" | "happy" | "surprised" | "encouraging"
}

// Removed AnimeCharacterModel and AnimatedBackground components

export function Anime3DCharacter({
  tutorId,
  isActive,
  isSpeaking,
  tutorColor,
  tutorName,
  emotion,
}: Anime3DCharacterProps) {
  // The video element will replace the 3D canvas
  // The isActive, isSpeaking, emotion props will now primarily control the overlay indicators and AI voice
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 shadow-lg relative">
      <video
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3f5003aa-ae98-4fd1-8e94-a64a715b21ef-tE9LV1u8JuEUJcefmk22JXyavBWmX2.mp4" // Path to the video file
        autoPlay
        loop
        muted // Mute original sound
        playsInline // Important for mobile autoplay
        className="w-full h-full object-cover" // Cover the entire container
      />

      {/* Floating status indicator (retained from previous version) */}
      {(isActive || isSpeaking) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-gray-200 animate-bounce">
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Speaking</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Thinking</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Character info overlay (retained from previous version) */}
      <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-gray-800 text-sm px-3 py-2 rounded-lg backdrop-blur-sm shadow-md z-10">
        <div className="font-semibold">{tutorName}</div>
        <div className="text-xs opacity-70">AI Video Tutor</div>
      </div>

      {/* Controls overlay (retained, but now just informational as video is static) */}
      <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Video Stream</span>
        </div>
      </div>
    </div>
  )
}
