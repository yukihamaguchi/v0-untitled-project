"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TipHistoryCard } from "@/components/tip-history-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings } from "lucide-react"
import { clearUserSession, getUserSession } from "@/utils/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: "ユーザー",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  useEffect(() => {
    // セッション情報を取得
    const session = getUserSession()
    if (session) {
      setUser({
        name: session.name,
        email: session.email,
        avatar: "/placeholder.svg?height=100&width=100",
      })
    } else {
      // ログインしていない場合はログインページにリダイレクト
      router.push("/login")
    }
  }, [router])

  // ログアウト処理
  const handleLogout = () => {
    clearUserSession()
    router.push("/login")
  }

  // 仮のギフティング履歴
  const tipHistory = [
    {
      id: 1,
      performer: "天野 しずく",
      event: "サマーフェス2025",
      amount: 1000,
      date: "2023-07-15",
    },
    {
      id: 2,
      performer: "早乙女 みなと",
      event: "5周年ライブin横アリ",
      amount: 3000,
      date: "2023-12-24",
    },
    {
      id: 3,
      performer: "有栖川 りお",
      event: "生誕祭2025",
      amount: 5000,
      date: "2024-04-10",
    },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">プロフィール</h1>

      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-primary/5">
        <CardContent className="pt-5 px-4 pb-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-2">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-md transform scale-90" />
              <Avatar className="h-16 w-16 relative z-10 border-2 border-background">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex justify-center gap-3 mb-1">
            <Button variant="outline" size="sm" className="gap-1 rounded-full h-8 text-xs">
              <Settings className="h-3 w-3" />
              設定
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-destructive rounded-full h-8 text-xs"
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3" />
              ログアウト
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-bold mb-3">ギフティング履歴</h2>
        <TipHistoryCard tipHistory={tipHistory} />
      </div>
    </div>
  )
}
