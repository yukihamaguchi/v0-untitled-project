"use client"

import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-animation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  const { ref, isInView } = useInView<HTMLDivElement>()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
