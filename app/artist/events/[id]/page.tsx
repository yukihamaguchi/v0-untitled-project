"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CalendarIcon, DownloadIcon, MapPinIcon, ShareIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ArtistHeader } from "@/components/artist-header"
import { MessageList } from "@/components/message-list"
import { GiftingStats } from "@/components/gifting-stats"
import { getUserSession } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { getEventGiftings } from "@/app/actions/gifting-actions"
import { useToast } from "@/hooks/use-toast"
import type { GiftingData } from "@/lib/supabase"

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const eventId = Number.parseInt(params.id)
  const [activeTab, setActiveTab] = useState("messages")
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [giftingData, setGiftingData] = useState<any>({
    totalAmount: 0,
    averageAmount: 0,
    messageCount: 0,
    topAmount: 0,
    amountByTime: [],
    amountByCategory: [],
  })

  useEffect(() => {
    // セッション情報を取得
    const session = getUserSession()
    if (!session || session.role !== "artist") {
      // アーティストでない場合はログインページにリダイレクト
      router.push("/artist/login")
      return
    }

    // イベントのギフティングデータを取得
    fetchEventGiftings(eventId)
  }, [eventId, router])

  // イベントのギフティングデータを取得する関数
  const fetchEventGiftings = async (eventId: number) => {
    try {
      setIsLoading(true)
      const result = await getEventGiftings(eventId)

      if (result.success && result.data) {
        const giftings = result.data as GiftingData[]

        // メッセージリストを作成
        const messageList = giftings.map((gifting) => ({
          id: gifting.id || 0,
          userName: gifting.user_name,
          message: gifting.comment || "メッセージなし",
          amount: gifting.amount,
          date: gifting.created_at || new Date().toISOString(),
        }))

        setMessages(messageList)

        // ギフティング統計データを作成
        const totalAmount = giftings.reduce((sum, gifting) => sum + gifting.amount, 0)
        const messageCount = giftings.length
        const averageAmount = messageCount > 0 ? Math.round(totalAmount / messageCount) : 0
        const topAmount = messageCount > 0 ? Math.max(...giftings.map((g) => g.amount)) : 0

        // 時間帯別データを作成（実際のアプリではより詳細な集計が必要）
        const timeMap = new Map<string, number>()
        giftings.forEach((gifting) => {
          if (gifting.created_at) {
            const date = new Date(gifting.created_at)
            const hour = date.getHours().toString().padStart(2, "0")
            const timeKey = `${hour}:00`
            const current = timeMap.get(timeKey) || 0
            timeMap.set(timeKey, current + gifting.amount)
          }
        })

        const amountByTime = Array.from(timeMap.entries()).map(([time, amount]) => ({
          time,
          amount,
        }))

        // 金額別データを作成
        const categoryMap = new Map<string, number>()
        giftings.forEach((gifting) => {
          let category
          if (gifting.amount <= 500) category = "500円以下"
          else if (gifting.amount <= 1000) category = "1,000円"
          else if (gifting.amount <= 3000) category = "3,000円"
          else if (gifting.amount <= 5000) category = "5,000円"
          else category = "10,000円以上"

          const current = categoryMap.get(category) || 0
          categoryMap.set(category, current + 1)
        })

        const amountByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
          category,
          count,
        }))

        setGiftingData({
          totalAmount,
          averageAmount,
          messageCount,
          topAmount,
          amountByTime:
            amountByTime.length > 0
              ? amountByTime
              : [
                  { time: "12:00", amount: 0 },
                  { time: "13:00", amount: 0 },
                  { time: "14:00", amount: 0 },
                  { time: "15:00", amount: 0 },
                  { time: "16:00", amount: 0 },
                ],
          amountByCategory:
            amountByCategory.length > 0
              ? amountByCategory
              : [
                  { category: "500円以下", count: 0 },
                  { category: "1,000円", count: 0 },
                  { category: "3,000円", count: 0 },
                  { category: "5,000円", count: 0 },
                  { category: "10,000円以上", count: 0 },
                ],
        })
      } else {
        toast({
          title: "エラー",
          description: result.error || "ギフティングデータの取得に失敗しました",
          variant: "destructive",
        })
        // エラー時はデフォルトのデータを使用
        setMessages([])
      }
    } catch (error) {
      console.error("Error fetching event giftings:", error)
      toast({
        title: "エラー",
        description: "ギフティングデータの取得中にエラーが発生しました",
        variant: "destructive",
      })
      // エラー時はデフォルトのデータを使用
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  // 仮のアーティストデータ
  const artist = {
    id: 1,
    name: "天野 しずく",
    occupation: "声優",
    agency: "ドリームボイス",
    image: "/images/performer-1.jpeg",
  }

  // 仮のイベントデータ
  const events = {
    "1": {
      id: 1,
      title: "サマーフェス2025",
      date: "2025-07-20",
      location: "さいたまスーパーアリーナ",
      description: "2025年夏最大の音楽フェスティバル。様々なジャンルのアーティストが集結します。",
      image: "/images/concert.png",
      totalGifting: giftingData.totalAmount,
      messageCount: giftingData.messageCount,
    },
    "2": {
      id: 2,
      title: "5周年ライブin横アリ",
      date: "2025-07-26",
      location: "横浜アリーナ",
      description: "デビュー5周年を記念した特別ライブイベント。豪華ゲストも多数出演予定。",
      image: "/images/concert-lights.jpeg",
      totalGifting: giftingData.totalAmount,
      messageCount: giftingData.messageCount,
    },
    "3": {
      id: 3,
      title: "生誕祭2025",
      date: "2025-04-15",
      location: "サイエンスホール",
      description: "アーティスト生誕を祝う特別なイベント。ファン感謝祭としても位置づけられています。",
      image: "/images/concert-audience.jpeg",
      totalGifting: giftingData.totalAmount,
      messageCount: giftingData.messageCount,
    },
    "4": {
      id: 4,
      title: "ウィンターライブ2024",
      date: "2024-12-24",
      location: "東京ドームシティホール",
      description: "クリスマスイブに開催される特別なライブイベント。",
      image: "/images/concert.png",
      totalGifting: giftingData.totalAmount,
      messageCount: giftingData.messageCount,
    },
  }

  const event = events[params.id as keyof typeof events] || events["1"]

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-8">
      <ArtistHeader artist={artist} />

      <main className="container max-w-4xl mx-auto px-4 pt-6">
        <div className="mb-6">
          <Link href="/artist/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              ダッシュボードに戻る
            </Button>
          </Link>

          <Card className="overflow-hidden border-none shadow-lg">
            <div className="relative h-48">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString("ja-JP")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">総ギフティング</p>
                  <p className="text-xl font-bold text-primary">¥{giftingData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">メッセージ数</p>
                  <p className="text-xl font-bold text-primary">{giftingData.messageCount}件</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  共有
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  レポート
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="messages" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">メッセージ</TabsTrigger>
            <TabsTrigger value="stats">統計</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-4">
            <MessageList messages={messages} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <GiftingStats data={giftingData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
