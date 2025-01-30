"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ArrowRight, Clock, Home, MoreHorizontal } from "lucide-react"
import { Tooltip, TooltipProvider } from "./ui/tooltip"
import { Footnote } from "./ui/footnote"
import { createRoot } from "react-dom/client"

export function SearchSection() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")
  const [loadingMessage, setLoadingMessage] = useState("")

  const loadingMessages = [
    "Considering question",
    "Reviewing statuses",
    "Reviewing laws of various jurisdictions",
    "Reviewing relationship between laws",
  ]

  useEffect(() => {
    if (isLoading) {
      let currentIndex = 0
      const intervalId = setInterval(() => {
        setLoadingMessage(loadingMessages[currentIndex])
        currentIndex = (currentIndex + 1) % loadingMessages.length
      }, 2000)

      return () => clearInterval(intervalId)
    }
  }, [isLoading])

  const formatAnswer = (rawAnswer: string) => {
    const withoutThinking = rawAnswer.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    
    // First find and store all sources
    let sourceCount = 1
    const sourceMap = new Map()
    
    // Match markdown links in the Sources section
    const sourcesSection = withoutThinking.match(/Sources:([\s\S]*?)(?=Answer:)/)?.[1] || ''
    const sourceLinks = Array.from(sourcesSection.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g))
    
    sourceLinks.forEach(([_, title, url]) => {
      sourceMap.set(sourceCount++, { title, url })
    })

    // Replace full source lines with Footnote components
    let formattedText = withoutThinking.replace(
      /• \[([^\]]+)\]\(([^)]+)\)/g,
      (_, title, url) => {
        const num = Array.from(sourceMap.entries()).find(([_, s]) => s.url === url)?.[0]
        return `<footnote data-id="${num}" data-headline="${title}" data-url="${url}"></footnote>`
      }
    )

    // Clean up and format paragraphs
    const paragraphs = formattedText.split('\n')
    const formatted = paragraphs
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .join('\n\n')

    return formatted
  }

  const handleButtonClick = (text: string) => {
    setQuestion(text)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || isLoading) return

    setIsLoading(true)
    setAnswer("")
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
          messages: [
            { 
              role: 'system', 
              content: 'You are an immigration advisor. For each answer:\n\n' +
                      '1. First, put ALL your reasoning inside <think></think> tags\n' +
                      '2. Then, AFTER the think tags, structure your response as:\n\n' +
                      '• Key Points: List 2-3 bullet points\n' +
                      '• Sources: List sources in format: • [Title of Source](URL)\n' +
                      '• Answer: One clear paragraph\n\n' +
                      'Example format:\n' +
                      '<think>Your reasoning here...</think>\n\n' +
                      'Key Points:\n' +
                      '• Point 1\n' +
                      '• Point 2\n\n' +
                      'Sources:\n' +
                      '• [USCIS - Official Guide](https://www.uscis.gov/guide)\n' +
                      '• [Travel.State.Gov](https://travel.state.gov)\n\n' +
                      'Answer:\n' +
                      'Clear answer here.'
            },
            { role: 'user', content: question }
          ],
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      if (data.choices && data.choices[0]) {
        const rawAnswer = data.choices[0].message.content
        const formattedAnswer = formatAnswer(rawAnswer)
        setAnswer(formattedAnswer)
      } else {
        setError('Unexpected API response format')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6">What do you want to know?</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Ask anything..."
            className="w-full text-lg p-6 pr-12 border-gray-300 rounded-lg"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 animate-pulse">
              {loadingMessage}...
            </div>
          )}
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-4 border border-red-500 rounded-md text-red-500">
          {error}
        </div>
      )}

      {answer && (
        <div 
          className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg animate-fadeIn"
          ref={(node) => {
            if (node) {
              // Replace footnote placeholders with actual Footnote components
              const footnotes = node.getElementsByTagName('footnote')
              Array.from(footnotes).forEach(footnote => {
                const id = parseInt(footnote.dataset.id || '0')
                const headline = footnote.dataset.headline || ''
                const url = footnote.dataset.url || ''
                
                const wrapper = document.createElement('span')
                const root = createRoot(wrapper)
                root.render(
                  <Footnote 
                    id={id} 
                    headline={headline} 
                    summary={url} 
                  />
                )
                footnote.parentNode?.replaceChild(wrapper, footnote)
              })
            }
          }}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("What's my next step with USCIS?")}
          disabled={isLoading}
        >
          <ArrowRight className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">What&apos;s my next step with USCIS?</span>
        </Button>
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("Greencard processing timeline?")}
          disabled={isLoading}
        >
          <Clock className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">Greencard processing timeline?</span>
        </Button>
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("How long can I stay in the EU?")}
          disabled={isLoading}
        >
          <Home className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">How long can I stay in the EU?</span>
        </Button>
        <Button
          variant="outline"
          className="justify-start h-auto py-4 px-6 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-lg shadow-sm"
          onClick={() => handleButtonClick("I have another question...")}
          disabled={isLoading}
        >
          <MoreHorizontal className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-medium">More</span>
        </Button>
      </div>
    </div>
  )
} 