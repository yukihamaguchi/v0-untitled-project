"use client"

import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function EventsPage() {
  // 仮のイベントデータ
  const events = [
    {
      id: 1,
      title: "【阪神店】喫茶しーぷいへようこそ！",
      date: "2025-07-20",
      location: "さいたまスーパーアリーナ",
      image: "/images/concert.png",
    },
    {
      id: 2,
      title: "5周年ライブin横アリ",
      date: "2025-07-26",
      location: "横浜アリーナ",
      image: "/images/concert-lights.jpeg",
    },
    {
      id: 3,
      title: "生誕祭2025",
      date: "2025-07-27",
      location: "サイエンスホール",
      image: "/images/concert-audience.jpeg",
    },
    {
      id: 4,
      title: "ジャズナイト2024",
      date: "2024-05-20",
      location: "ブルーノート東京",
      image: "/images/concert-lights.jpeg",
    },
    {
      id: 5,
      title: "ロックフェスティバル2024",
      date: "2024-08-15",
      location: "幕張メッセ",
      image: "/images/concert-audience.jpeg",
    },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">イベント検索</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="イベント名、場所などで検索" className="pl-10" />
      </div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  )
}
