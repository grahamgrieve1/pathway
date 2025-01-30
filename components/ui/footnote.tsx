"use client"

import { useState, useEffect, useRef } from "react"

interface FootnoteProps {
  id: number
  headline: string
  summary: string
}

export function Footnote({ id, headline, summary }: FootnoteProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const footnoteRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 300)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (footnoteRef.current && !footnoteRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className="relative inline-block align-baseline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-expanded={isExpanded}
        aria-controls={`footnote-content-${id}`}
      >
        {id}
      </button>
      {isExpanded && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" aria-hidden="true" />
          <div
            ref={footnoteRef}
            id={`footnote-content-${id}`}
            className="absolute left-0 bottom-full mb-2 z-50 p-4 text-sm bg-white border border-gray-200 rounded-xl shadow-lg w-[400px] max-w-[90vw]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className="font-bold mb-2">{headline}</p>
            <p className="text-gray-700">{summary}</p>
          </div>
        </>
      )}
    </span>
  )
} 