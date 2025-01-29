"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ArrowRight, Clock, Home, MoreHorizontal } from "lucide-react"

export function SearchSection() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleButtonClick = (text: string) => {
    setQuestion(text)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-reasoning',
          messages: [{ role: 'user', content: question }],
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      if (data.choices && data.choices[0]) {
        setAnswer(data.choices[0].message.content)
      } else {
        setError('Unexpected API response format')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6">What do you want to know?</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Ask anything..."
          className="w-full mb-6 text-lg p-6 border-gray-300 rounded-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("What's my next step with USCIS?")}
        >
          <ArrowRight className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">What&apos;s my next step with USCIS?</span>
        </Button>
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("Greencard processing timeline?")}
        >
          <Clock className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">Greencard processing timeline?</span>
        </Button>
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("How long can I stay in the EU?")}
        >
          <Home className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">How long can I stay in the EU?</span>
        </Button>
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("I have another question...")}
        >
          <MoreHorizontal className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">More</span>
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 border border-red-500 rounded-md text-red-500">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="font-bold mb-2">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
} 