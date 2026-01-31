"use client"

import { useEffect, useState } from "react"
import { clsx } from "clsx"

const cn = clsx

interface TypingAnimationProps {
  children: string
  className?: string
  duration?: number
  delay?: number
}

export function TypingAnimation({ children, className, duration = 50, delay = 0 }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (currentIndex < children.length) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev + children[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }, duration)

        return () => clearTimeout(timer)
      }
    }, delay)

    return () => clearTimeout(startTimer)
  }, [currentIndex, children, duration, delay])

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {currentIndex < children.length && <span className="animate-pulse ml-1">|</span>}
    </span>
  )
}
