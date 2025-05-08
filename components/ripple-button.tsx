"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RippleButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function RippleButton({
  children,
  className,
  onClick,
  variant = "default",
  size = "default",
  type = "button",
  disabled = false,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []

    ripples.forEach((ripple) => {
      const timeoutId = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.filter((r) => r.id !== ripple.id))
      }, 600)

      timeoutIds.push(timeoutId)
    })

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [ripples])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const size = Math.max(rect.width, rect.height) * 2

    setRipples([...ripples, { x, y, size, id: Date.now() }])

    if (onClick) onClick()
  }

  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      variant={variant}
      size={size}
      type={type}
      disabled={disabled}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {children}
    </Button>
  )
}
