import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Tutor {
  id: string
  name: string
  language: string
  specialty: string
  personality: string
  avatar: string
  color: string
  accent: string
}

interface TutorCardProps {
  tutor: Tutor
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className={`${tutor.color} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
      <CardHeader className="text-center">
        <div className="text-6xl mb-4 animate-bounce">{tutor.avatar}</div>
        <CardTitle className="text-xl font-bold">{tutor.name}</CardTitle>
        <CardDescription>
          <Badge variant="secondary" className={tutor.accent}>
            {tutor.language}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Specialty:</h4>
          <p className="text-sm text-gray-600">{tutor.specialty}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Personality:</h4>
          <p className="text-sm text-gray-600">{tutor.personality}</p>
        </div>
        <Link href={`/chat/${tutor.id}`} className="block">
          <Button className="w-full mt-4" variant="default">
            Start Learning with {tutor.name}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
