"use client"

import { Home, Calendar, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "ホーム",
      href: "/",
      icon: Home,
    },
    {
      name: "イベント",
      href: "/events",
      icon: Calendar,
    },
    {
      name: "フォロー中",
      href: "/following",
      icon: Heart,
    },
    {
      name: "プロフィール",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="flex justify-around items-center h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center">
                <item.icon className="h-4 w-4" />
                <span className="text-[10px] mt-1">{item.name}</span>
                {isActive && (
                  <motion.div
                    className="h-1 w-4 bg-primary rounded-full mt-1"
                    layoutId="activeTab"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}
