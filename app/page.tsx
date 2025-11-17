"use client"

import { EventCard } from "@/components/event-card"

export default function Home() {
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
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">イベント一覧</h1>

      <div className="space-y-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  )
}
