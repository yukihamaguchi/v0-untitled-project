"use client"

import { EventCard } from "@/components/event-card"
import { PerformerCard } from "@/components/performer-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FollowingPage() {
  const performers = [
    {
      id: 1,
      name: "ヴィンセント・オン",
      occupation: "ピアニスト",
      agency: "ジャパン・アーツ",
      image: "/images/vincent-ong.png",
    },
  ]

  const events = [
    {
      id: 1,
      title: "ヴィンセント・オン ピアノ・リサイタル",
      date: "2026-02-05",
      location: "浜離宮朝日ホール",
      image: "/images/concert-hall.png",
      performers: ["ヴィンセント・オン"],
    },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">フォロー中</h1>

      <div>
        <Tabs defaultValue="events">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">イベント</TabsTrigger>
            <TabsTrigger value="performers">出演者</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-4 space-y-6">
            {events.length > 0 ? (
              events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">フォロー中の出演者のイベントはありません</div>
            )}
          </TabsContent>

          <TabsContent value="performers" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {performers.length > 0 ? (
                performers.map((performer, index) => (
                  <PerformerCard key={performer.id} performer={performer} eventId={0} index={index} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground col-span-2">フォロー中の出演者はいません</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
