"use client"

import { Home, Building2, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "ホーム",
      href: "/",
      icon: Home,
    },
    {
      name: "事務所",
      href: "/agencies",
      icon: Building2,
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
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg">
      <nav className="flex justify-around items-center h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div className="flex flex-col items-center">
                <item.icon className="h-4 w-4" />
                <span className="text-[10px] mt-1">{item.name}</span>
                {isActive && <div className="h-1 w-4 bg-primary rounded-full mt-1" />}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
