"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TipHistoryCard } from "@/components/tip-history-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings } from "lucide-react"
import { clearUserSession, getUserSession } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { MessageList } from "@/components/message-list"; // Added import

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: "ユーザー",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    id: 1 // Added user ID -  This is a crucial assumption.  A real application would fetch this from the session.
  })

  useEffect(() => {
    // セッション情報を取得
    const session = getUserSession()
    if (session) {
      setUser({
        name: session.name,
        email: session.email,
        avatar: "/placeholder.svg?height=100&width=100",
        id: session.id // Assumed session contains user ID
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

  // This is now redundant since we fetch the history from the API.
  // const tipHistory = [ ... ];


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
          <div className="mt-8"> {/* Added div for spacing */}
            <h2 className="text-lg font-bold mb-4">ギフティング履歴</h2>
            <MessageList userId={user.id} /> {/* Pass userId to MessageList */}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}