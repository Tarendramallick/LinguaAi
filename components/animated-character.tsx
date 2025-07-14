"use client"

import { Anime3DCharacter } from "@/components/anime-3d-character"

interface AnimatedCharacterProps {
  avatar: string
  isActive: boolean
  color: string
  name: string
  isSpeaking?: boolean
  tutorId?: string
  emotion?: "neutral" | "thinking" | "happy" | "surprised" | "encouraging"
}

export function AnimatedCharacter({
  avatar,
  isActive,
  color,
  name,
  isSpeaking = false,
  tutorId = "universal-tutor", // Default to universal tutor ID
  emotion = "neutral", // Default emotion
}: AnimatedCharacterProps) {
  // This component now exclusively renders the Anime3DCharacter (video)
  // and its associated status indicators.
  return (
    <div className="flex flex-col items-center space-y-4">
      <Anime3DCharacter
        tutorId={tutorId}
        isActive={isActive}
        isSpeaking={isSpeaking}
        tutorColor={color}
        tutorName={name}
        emotion={emotion} // Pass the emotion prop
      />

      {/* Enhanced status indicators for 3D character */}
      <div className="text-center space-y-3">
        {isSpeaking && (
          <div className="flex items-center justify-center gap-3 bg-green-50 rounded-full px-4 py-2 border border-green-200">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-6 bg-green-500 rounded animate-pulse`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${16 + Math.sin(i) * 8}px`,
                  }}
                ></div>
              ))}
            </div>
            <span className={`text-sm ${color} font-medium`}>Speaking in video...</span>
          </div>
        )}

        {isActive && !isSpeaking && (
          <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <span className={`text-sm ${color} animate-pulse font-medium`}>Processing...</span>
          </div>
        )}

        {!isActive && !isSpeaking && (
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className={`text-sm ${color} opacity-70`}>Ready for conversation!</span>
          </div>
        )}
      </div>
    </div>
  )
}
