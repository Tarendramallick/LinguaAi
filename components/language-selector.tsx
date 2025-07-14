"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ArrowRight, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
]

export function LanguageSelector() {
  const [nativeLanguage, setNativeLanguage] = useState<string>("")
  const [targetLanguage, setTargetLanguage] = useState<string>("")
  const [showNativeDropdown, setShowNativeDropdown] = useState(false)
  const [showTargetDropdown, setShowTargetDropdown] = useState(false)
  const router = useRouter()

  const handleStartLearning = () => {
    if (nativeLanguage && targetLanguage && nativeLanguage !== targetLanguage) {
      // Navigate to chat with language parameters
      router.push(`/chat?native=${nativeLanguage}&target=${targetLanguage}`)
    }
  }

  const getNativeLanguageInfo = () => languages.find((lang) => lang.code === nativeLanguage)
  const getTargetLanguageInfo = () => languages.find((lang) => lang.code === targetLanguage)

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Language Journey</h2>
            <p className="text-gray-600">Select your native language and the language you want to learn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Native Language Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">I speak</label>
              <div className="relative">
                <button
                  onClick={() => setShowNativeDropdown(!showNativeDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {nativeLanguage ? (
                      <>
                        <span className="text-2xl">{getNativeLanguageInfo()?.flag}</span>
                        <span className="font-medium text-gray-900">{getNativeLanguageInfo()?.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select your native language</span>
                    )}
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>

                {showNativeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setNativeLanguage(language.code)
                          setShowNativeDropdown(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">{language.flag}</span>
                        <span className="font-medium text-gray-900">{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Language Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">I want to learn</label>
              <div className="relative">
                <button
                  onClick={() => setShowTargetDropdown(!showTargetDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {targetLanguage ? (
                      <>
                        <span className="text-2xl">{getTargetLanguageInfo()?.flag}</span>
                        <span className="font-medium text-gray-900">{getTargetLanguageInfo()?.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select language to learn</span>
                    )}
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>

                {showTargetDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {languages
                      .filter((lang) => lang.code !== nativeLanguage)
                      .map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setTargetLanguage(language.code)
                            setShowTargetDropdown(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-xl">{language.flag}</span>
                          <span className="font-medium text-gray-900">{language.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Start Learning Button */}
          <div className="text-center">
            <Button
              onClick={handleStartLearning}
              disabled={!nativeLanguage || !targetLanguage || nativeLanguage === targetLanguage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {nativeLanguage && targetLanguage && nativeLanguage !== targetLanguage && (
              <p className="text-sm text-gray-600 mt-4">
                Ready to learn {getTargetLanguageInfo()?.name} from {getNativeLanguageInfo()?.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
