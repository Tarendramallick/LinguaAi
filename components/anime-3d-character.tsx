"use client"

interface Anime3DCharacterProps {
  tutorId: string
  isActive: boolean // Represents thinking/processing
  isSpeaking: boolean
  isListening: boolean // New prop for listening state
  tutorColor: string
  tutorName: string
  emotion: "neutral" | "thinking" | "happy" | "surprised" | "encouraging"
}

export function Anime3DCharacter({
  tutorId,
  isActive,
  isSpeaking,
  isListening,
  tutorColor,
  tutorName,
  emotion,
}: Anime3DCharacterProps) {
  // Determine which asset to display based on state
  let currentAssetSrc: string
  let isVideo = false

  if (isSpeaking) {
    currentAssetSrc = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/talking-eeWYV3LiBOyoL3q1Lbz0tdtiNYvgi5.mp4"
    isVideo = true
  } else if (isListening) {
    currentAssetSrc = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listening-qLIHIDEnCMYGHlkkbZP16rz6RrazKt.mp4"
    isVideo = true
  } else {
    // Default to idle image when not speaking or listening
    currentAssetSrc = "/images/female-tutor-idle.png"
    isVideo = false
  }

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 shadow-lg relative">
      {isVideo ? (
        <video
          key={currentAssetSrc} // Key ensures video re-mounts and plays from start when source changes
          src={currentAssetSrc}
          autoPlay
          loop
          muted // Mute original sound from video
          playsInline
          className="w-full h-full object-cover"
          onLoadStart={() => console.log(`Loading video: ${currentAssetSrc}`)}
          onCanPlay={() => console.log(`Video ready to play: ${currentAssetSrc}`)}
          onError={(e) => console.error(`Video error for ${currentAssetSrc}:`, e)}
        />
      ) : (
        <img
          src={currentAssetSrc || "/placeholder.svg"}
          alt={`${tutorName} idle pose`}
          className="w-full h-full object-cover"
          onLoad={() => console.log(`Image loaded: ${currentAssetSrc}`)}
          onError={(e) => console.error(`Image error for ${currentAssetSrc}:`, e)}
        />
      )}

      {/* Floating status indicator */}
      {(isActive || isSpeaking || isListening) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-gray-200 animate-bounce">
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Speaking</span>
                </>
              ) : isListening ? (
                <>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Listening</span>
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

      {/* Character info overlay */}
      <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-gray-800 text-sm px-3 py-2 rounded-lg backdrop-blur-sm shadow-md z-10">
        <div className="font-semibold">{tutorName}</div>
        <div className="text-xs opacity-70">AI Language Tutor</div>
      </div>

      {/* Enhanced controls overlay with state information */}
      <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              isSpeaking ? "bg-green-400" : isListening ? "bg-purple-400" : isActive ? "bg-blue-400" : "bg-gray-400"
            }`}
          ></div>
          <span>{isSpeaking ? "Speaking" : isListening ? "Listening" : isActive ? "Thinking" : "Ready"}</span>
        </div>
      </div>

      {/* Subtle animation overlay for better visual feedback */}
      {(isSpeaking || isListening) && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute inset-0 rounded-xl ${
              isSpeaking ? "bg-green-500 bg-opacity-5 animate-pulse" : "bg-purple-500 bg-opacity-5 animate-pulse"
            }`}
          ></div>
        </div>
      )}
    </div>
  )
}
