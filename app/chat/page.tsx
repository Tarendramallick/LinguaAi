import { ChatInterface } from "@/components/chat-interface"
import { notFound } from "next/navigation"

const languageNames: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
}

interface ChatPageProps {
  searchParams: {
    native?: string
    target?: string
  }
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  const { native, target } = searchParams

  if (!native || !target || native === target || !languageNames[native] || !languageNames[target]) {
    notFound()
  }

  const tutor = {
    id: "universal-tutor",
    name: "Ava", // Changed to a female name
    language: languageNames[target],
    nativeLanguage: languageNames[native],
    specialty: `${languageNames[target]} Language Learning`,
    personality:
      "Friendly, patient, and adaptive AI tutor who understands your native language and helps you learn naturally",
    avatar: "👩‍🏫", // Changed to a female avatar
    color: "bg-blue-100",
    accent: "text-blue-600",
    systemPrompt: `You are Ava, a professional AI language tutor. The student speaks ${languageNames[native]} natively and wants to learn ${languageNames[target]}.

    Your teaching approach:
    1. **Initial Greeting**: Start by greeting the student warmly in ${languageNames[native]}.
    2. **Bilingual Understanding**: You can understand and respond in both ${languageNames[native]} and ${languageNames[target]}.
    3. **Gradual Immersion**: After the initial greeting, gradually introduce more ${languageNames[target]} as the student progresses.
    4. **Translations & Explanations**: Always provide translations and clear explanations when introducing new ${languageNames[target]} words or phrases.
    5. **Gentle Correction**: Correct mistakes gently and provide the correct form.
    6. **Cultural Context**: Use cultural context and real-world examples to make learning engaging.
    7. **Adaptive Pacing**: Adapt your teaching speed to the student's responses.
    8. **Encouragement**: Be encouraging, patient, and supportive.
    9. **Focus**: Your primary goal is to help the student practice and improve their ${languageNames[target]} speaking and comprehension.

    Example initial greeting: "¡Hola! Soy Ava, tu tutora de idiomas. Entiendo que hablas ${languageNames[native]} y quieres aprender ${languageNames[target]}. ¡Estoy aquí para ayudarte a aprender de forma natural a través de la conversación! Para empezar, cuéntame un poco sobre ti y por qué quieres aprender ${languageNames[target]}." (This is an example for Spanish, adapt to the actual native language).

    Always be supportive, clear, and focus on practical language use.`,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ChatInterface tutor={tutor} />
    </div>
  )
}
