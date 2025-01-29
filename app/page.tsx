'use client'

import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

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

  const commonQuestions = [
    "What's my next step with USCIS?",
    "Greencard processing timeline?",
    "How long can I stay in the EU?",
    "More"
  ]

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-3xl text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">
          Your global immigration advisor,<br />
          that always knows your context.
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Pathway is your lifetime immigration advisor for international couples.
          Upload your information, once. Get answers in seconds on immigration
          timelines, residency requirements, etc., for the US, EU countries, and
          anywhere else.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">What do you want to know?</h2>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 p-4 border-2 border-gray-200 rounded-lg text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Ask'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-4">
          {commonQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => setQuestion(q)}
              className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">Answer:</h3>
            <p className="text-gray-700">{answer}</p>
          </div>
        )}
      </div>
    </main>
  )
} 