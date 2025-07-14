"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Mic, MicOff } from "lucide-react"

interface VoiceControlsProps {
  onSpeechToggle: (enabled: boolean) => void
  onVoiceSettingsChange: (settings: VoiceSettings) => void
}

interface VoiceSettings {
  rate: number
  pitch: number
  volume: number
  autoSpeak: boolean
}

export function VoiceControls({ onSpeechToggle, onVoiceSettingsChange }: VoiceControlsProps) {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8,
    autoSpeak: true,
  })

  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    onVoiceSettingsChange(voiceSettings)
  }, [voiceSettings, onVoiceSettingsChange])

  const toggleSpeech = () => {
    const newState = !speechEnabled
    setSpeechEnabled(newState)
    onSpeechToggle(newState)
    if (!newState) {
      speechSynthesis.cancel()
    }
  }

  const updateSetting = (key: keyof VoiceSettings, value: number | boolean) => {
    setVoiceSettings((prev) => ({ ...prev, [key]: value }))
  }

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsListening(true)
      // Voice recognition implementation would go here
      setTimeout(() => setIsListening(false), 3000) // Demo timeout
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Voice Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Speech Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Text-to-Speech</span>
          <Button variant="outline" size="sm" onClick={toggleSpeech} className="h-8 w-8 p-0 bg-transparent">
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* Voice Settings */}
        {speechEnabled && (
          <>
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Speed: {voiceSettings.rate.toFixed(1)}</label>
              <Slider
                value={[voiceSettings.rate]}
                onValueChange={([value]) => updateSetting("rate", value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Pitch: {voiceSettings.pitch.toFixed(1)}</label>
              <Slider
                value={[voiceSettings.pitch]}
                onValueChange={([value]) => updateSetting("pitch", value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Volume: {Math.round(voiceSettings.volume * 100)}%</label>
              <Slider
                value={[voiceSettings.volume]}
                onValueChange={([value]) => updateSetting("volume", value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Voice Input */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm">Voice Input</span>
          <Button
            variant="outline"
            size="sm"
            onClick={startListening}
            className={`h-8 w-8 p-0 ${isListening ? "bg-red-100 text-red-600" : ""}`}
          >
            {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
