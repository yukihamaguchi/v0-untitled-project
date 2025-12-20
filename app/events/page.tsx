"use client"

import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "ヴィンセント・オン ピアノ・リサイタル",
      date: "2026-02-05",
      location: "浜離宮朝日ホール",
      image: "/images/concert-hall.png",
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
