"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface HighlighterProps {
  children: React.ReactNode
  action?: "highlight" | "underline"
  color?: string
  className?: string
}

export function Highlighter({ children, action = "highlight", color = "#FF9800", className }: HighlighterProps) {
  if (action === "underline") {
    return (
      <span
        className={cn("relative inline-block", className)}
        style={{
          textDecoration: "underline",
          textDecorationColor: color,
          textDecorationThickness: "3px",
          textUnderlineOffset: "4px",
        }}
      >
        {children}
      </span>
    )
  }

  return <span className={cn("relative inline-block", className)}>{children}</span>
}
