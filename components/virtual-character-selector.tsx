"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VirtualCharacterOption {
  id: string
  name: string
  avatar: string
  style: "emoji" | "virtual" | "realistic"
  description: string
}

const characterOptions: VirtualCharacterOption[] = [
  {
    id: "emoji",
    name: "Emoji Style",
    avatar: "😊",
    style: "emoji",
    description: "Classic emoji characters with animations",
  },
  {
    id: "virtual",
    name: "Virtual Avatar",
    avatar: "🤖",
    style: "virtual",
    description: "Simple virtual face with expressions",
  },
  {
    id: "realistic",
    name: "Anime 3D",
    avatar: "✨",
    style: "realistic",
    description: "Beautiful anime-style 3D characters",
  },
]

interface VirtualCharacterSelectorProps {
  currentStyle: string
  onStyleChange: (style: string) => void
  tutorColor: string
}

export function VirtualCharacterSelector({ currentStyle, onStyleChange, tutorColor }: VirtualCharacterSelectorProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Character Style</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {characterOptions.map((option) => (
            <Button
              key={option.id}
              variant={currentStyle === option.style ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange(option.style)}
              className="justify-start h-auto p-3"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-lg">{option.avatar}</span>
                <div className="text-left">
                  <div className="font-medium text-xs">{option.name}</div>
                  <div className="text-xs opacity-70">{option.description}</div>
                </div>
                {option.style === "realistic" && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-gradient-to-r from-pink-100 to-purple-100">
                    ✨ New!
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
