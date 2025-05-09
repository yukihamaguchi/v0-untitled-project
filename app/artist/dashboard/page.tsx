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

export default function ArtistDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(true)

  const artist = {
    id: 1,
    name: "天野 しずく",
    occupation: "声優",
    agency: "ドリームボイス",
    image: "/images/performer-1.jpeg",
  }

  const [stats, setStats] = useState({
    totalGifting: 0,
    totalMessages: 0,
    upcomingEvents: [],
    pastEvents: [],
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/giftings/stats?performerId=${artist.id}`)
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [artist.id])

  const upcomingEvents = stats.upcomingEvents
  const pastEvents = stats.pastEvents

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

  // 合計ギフティング金額を計算
  const totalGifting = stats.totalGifting
  const totalMessages = stats.totalMessages

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
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => <ArtistEventCard key={event.id} event={event} />)
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">今後のイベントはありません</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-2">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => <ArtistEventCard key={event.id} event={event} />)
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