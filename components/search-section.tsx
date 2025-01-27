"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Clock, Home, MoreHorizontal } from "lucide-react"

export function SearchSection() {
  const [question, setQuestion] = useState("")

  const handleButtonClick = (text: string) => {
    setQuestion(text)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6">What do you want to know?</h2>
      <Input
        type="text"
        placeholder="Ask anything..."
        className="w-full mb-6 text-lg p-6 border-gray-300 rounded-lg"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
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
    </div>
  )
}

