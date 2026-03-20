"use client"
import { useState, useEffect } from "react"

export function Typewriter({ text, delay = 100 }: { text: string, delay?: number }) {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  return (
    <span className="inline-flex items-center">
      {currentText}
      <span className="w-[3px] h-[1em] bg-brand ml-1 animate-pulse" style={{ display: currentIndex < text.length ? 'inline-block' : 'inline-block' }}></span>
    </span>
  )
}
