"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TipHistoryCard } from "@/components/tip-history-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings } from "lucide-react"
import { clearUserSession, getUserSession } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { getUserGiftings } from "../actions/gifting-actions"
import { useToast } from "@/hooks/use-toast"
import type { GiftingData } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState({
    name: "ユーザー",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [tipHistory, setTipHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // セッション情報を取得
    const session = getUserSession()
    if (session) {
      setUser({
        name: session.name,
        email: session.email,
        avatar: "/placeholder.svg?height=100&width=100",
      })

      // ギフティング履歴を取得
      fetchGiftingHistory(session.email)
    } else {
      // ログインしていない場合はログインページにリダイレクト
      router.push("/login")
    }
  }, [router])

  // ギフティング履歴を取得する関数
  const fetchGiftingHistory = async (userId: string) => {
    try {
      setIsLoading(true)
      const result = await getUserGiftings(userId)

      if (result.success && result.data) {
        // データをTipHistoryCardで表示できる形式に変換
        const formattedHistory = result.data.map((gifting: GiftingData) => ({
          id: gifting.id || 0,
          performer: gifting.artist_name,
          event: gifting.event_name,
          amount: gifting.amount,
          date: gifting.created_at || new Date().toISOString(),
        }))

        setTipHistory(formattedHistory)
      } else {
        toast({
          title: "エラー",
          description: result.error || "ギフティング履歴の取得に失敗しました",
          variant: "destructive",
        })
        // エラー時は空の配列をセット
        setTipHistory([])
      }
    } catch (error) {
      console.error("Error fetching gifting history:", error)
      toast({
        title: "エラー",
        description: "ギフティング履歴の取得中にエラーが発生しました",
        variant: "destructive",
      })
      setTipHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  // ログアウト処理
  const handleLogout = () => {
    clearUserSession()
    router.push("/login")
  }

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
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">読み込み中...</CardContent>
          </Card>
        ) : (
          <TipHistoryCard tipHistory={tipHistory} />
        )}
      </div>
    </div>
  )
}
