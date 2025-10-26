"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <div className={cn("animate-fade-in", className)} style={{ animationDelay: `${delay * 0.05}s` }}>
      {children}
    </div>
  )
}
