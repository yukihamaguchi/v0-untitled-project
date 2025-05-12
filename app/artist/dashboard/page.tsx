"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { ArtistEventCard } from "@/components/artist-event-card"
import { ArtistHeader } from "@/components/artist-header"
import { getUserSession } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { getArtistGiftings } from "@/app/actions/gifting-actions"
import { useToast } from "@/hooks/use-toast"
import type { GiftingData } from "@/lib/supabase"

export default function ArtistDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(true)
  const [totalGifting, setTotalGifting] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [events, setEvents] = useState<any[]>([])

  // 仮のアーティストデータ
  const artist = {
    id: 1,
    name: "天野 しずく",
    occupation: "声優",
    agency: "ドリームボイス",
    image: "/images/performer-1.jpeg",
  }

  // 仮のイベントデータ
  const upcomingEventsData = [
    {
      id: 1,
      title: "サマーフェス2025",
      date: "2025-07-20",
      location: "さいたまスーパーアリーナ",
      image: "/images/concert.png",
      totalGifting: 0,
      messageCount: 0,
    },
    {
      id: 2,
      title: "5周年ライブin横アリ",
      date: "2025-07-26",
      location: "横浜アリーナ",
      image: "/images/concert-lights.jpeg",
      totalGifting: 0,
      messageCount: 0,
    },
  ]

  const pastEventsData = [
    {
      id: 3,
      title: "生誕祭2025",
      date: "2025-04-15",
      location: "サイエンスホール",
      image: "/images/concert-audience.jpeg",
      totalGifting: 0,
      messageCount: 0,
    },
    {
      id: 4,
      title: "ウィンターライブ2024",
      date: "2024-12-24",
      location: "東京ドームシティホール",
      image: "/images/concert.png",
      totalGifting: 0,
      messageCount: 0,
    },
  ]

  useEffect(() => {
    // セッション情報を取得
    const session = getUserSession()
    if (!session || session.role !== "artist") {
      // アーティストでない場合はログインページにリダイレクト
      router.push("/artist/login")
      return
    }

    // アーティストのギフティングデータを取得
    fetchArtistGiftings(session.email)
  }, [router])

  // アーティストのギフティングデータを取得する関数
  const fetchArtistGiftings = async (artistId: string) => {
    try {
      setIsLoading(true)
      const result = await getArtistGiftings(`artist-${artist.id}`) // 実際のアプリではアーティストの実際のIDを使用

      if (result.success && result.data) {
        // ギフティングデータを集計
        const giftings = result.data as GiftingData[]

        // 合計金額とメッセージ数を計算
        const total = giftings.reduce((sum, gifting) => sum + gifting.amount, 0)
        const messageCount = giftings.length

        setTotalGifting(total)
        setTotalMessages(messageCount)

        // イベントごとにギフティングデータを集計
        const eventMap = new Map<number, { totalGifting: number; messageCount: number }>()

        giftings.forEach((gifting) => {
          const eventId = gifting.event_id
          const current = eventMap.get(eventId) || { totalGifting: 0, messageCount: 0 }

          eventMap.set(eventId, {
            totalGifting: current.totalGifting + gifting.amount,
            messageCount: current.messageCount + 1,
          })
        })

        // イベントデータを更新
        const updatedUpcomingEvents = upcomingEventsData.map((event) => {
          const stats = eventMap.get(event.id)
          return {
            ...event,
            totalGifting: stats?.totalGifting || 0,
            messageCount: stats?.messageCount || 0,
          }
        })

        const updatedPastEvents = pastEventsData.map((event) => {
          const stats = eventMap.get(event.id)
          return {
            ...event,
            totalGifting: stats?.totalGifting || 0,
            messageCount: stats?.messageCount || 0,
          }
        })

        // 表示するイベントを選択
        setEvents(activeTab === "upcoming" ? updatedUpcomingEvents : updatedPastEvents)
      } else {
        toast({
          title: "エラー",
          description: result.error || "ギフティングデータの取得に失敗しました",
          variant: "destructive",
        })
        // エラー時はデフォルトのデータを使用
        setEvents(activeTab === "upcoming" ? upcomingEventsData : pastEventsData)
      }
    } catch (error) {
      console.error("Error fetching artist giftings:", error)
      toast({
        title: "エラー",
        description: "ギフティングデータの取得中にエラーが発生しました",
        variant: "destructive",
      })
      // エラー時はデフォルトのデータを使用
      setEvents(activeTab === "upcoming" ? upcomingEventsData : pastEventsData)
    } finally {
      setIsLoading(false)
    }
  }

  // タブ切り替え時の処理
  useEffect(() => {
    setEvents(activeTab === "upcoming" ? upcomingEventsData : pastEventsData)
  }, [activeTab])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-8">
      <ArtistHeader artist={artist} />

      <main className="container max-w-4xl mx-auto px-4 pt-6">
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">総ギフティング</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{totalGifting.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">全イベント合計</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">総メッセージ数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground mt-1">全イベント合計</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">今後のイベント</TabsTrigger>
              <TabsTrigger value="past">過去のイベント</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="text-xs">
              <CalendarIcon className="h-3 w-3 mr-1" />
              カレンダー表示
            </Button>
          </div>

          <TabsContent value="upcoming" className="space-y-4 mt-2">
            {events.length > 0 ? (
              events.map((event) => <ArtistEventCard key={event.id} event={event} />)
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">今後のイベントはありません</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-2">
            {events.length > 0 ? (
              events.map((event) => <ArtistEventCard key={event.id} event={event} />)
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">過去のイベントはありません</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
