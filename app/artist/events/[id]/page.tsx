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

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter()
  const eventId = Number.parseInt(React.use(params).id)
  const [activeTab, setActiveTab] = useState("messages")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // セッション情報を取得
    const session = getUserSession()
    if (!session || session.role !== "artist") {
      // アーティストでない場合はログインページにリダイレクト
      router.push("/artist/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

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
      totalGifting: 125000,
      messageCount: 42,
    },
    "2": {
      id: 2,
      title: "5周年ライブin横アリ",
      date: "2025-07-26",
      location: "横浜アリーナ",
      description: "デビュー5周年を記念した特別ライブイベント。豪華ゲストも多数出演予定。",
      image: "/images/concert-lights.jpeg",
      totalGifting: 0,
      messageCount: 0,
    },
    "3": {
      id: 3,
      title: "生誕祭2025",
      date: "2025-04-15",
      location: "サイエンスホール",
      description: "アーティスト生誕を祝う特別なイベント。ファン感謝祭としても位置づけられています。",
      image: "/images/concert-audience.jpeg",
      totalGifting: 87500,
      messageCount: 35,
    },
    "4": {
      id: 4,
      title: "ウィンターライブ2024",
      date: "2024-12-24",
      location: "東京ドームシティホール",
      description: "クリスマスイブに開催される特別なライブイベント。",
      image: "/images/concert.png",
      totalGifting: 156000,
      messageCount: 64,
    },
  }

  const event = events[params.id as keyof typeof events] || events["1"]

  // 仮のメッセージデータ
  const messages = [
    {
      id: 1,
      userName: "ファン1",
      message: "素晴らしいパフォーマンスでした！次回も楽しみにしています。",
      amount: 5000,
      date: "2025-07-20T14:30:00",
    },
    {
      id: 2,
      userName: "ファン2",
      message: "いつも応援しています！これからも頑張ってください！",
      amount: 3000,
      date: "2025-07-20T15:15:00",
    },
    {
      id: 3,
      userName: "ファン3",
      message: "声が本当に素敵です。癒されました。",
      amount: 10000,
      date: "2025-07-20T16:00:00",
    },
    {
      id: 4,
      userName: "ファン4",
      message: "初めて生で見ましたが、想像以上でした！",
      amount: 1000,
      date: "2025-07-20T16:30:00",
    },
    {
      id: 5,
      userName: "ファン5",
      message: "次回のイベントも必ず参加します！",
      amount: 5000,
      date: "2025-07-20T17:00:00",
    },
  ]

  // 仮のギフティング統計データ
  const giftingData = {
    totalAmount: event.totalGifting,
    averageAmount: event.messageCount > 0 ? Math.round(event.totalGifting / event.messageCount) : 0,
    messageCount: event.messageCount,
    topAmount: 10000,
    amountByTime: [
      { time: "12:00", amount: 15000 },
      { time: "13:00", amount: 25000 },
      { time: "14:00", amount: 35000 },
      { time: "15:00", amount: 30000 },
      { time: "16:00", amount: 20000 },
    ],
    amountByCategory: [
      { category: "1,000円", count: 15 },
      { category: "3,000円", count: 10 },
      { category: "5,000円", count: 12 },
      { category: "10,000円", count: 5 },
    ],
  }

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
                  <p className="text-xl font-bold text-primary">¥{event.totalGifting.toLocaleString()}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">メッセージ数</p>
                  <p className="text-xl font-bold text-primary">{event.messageCount}件</p>
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
