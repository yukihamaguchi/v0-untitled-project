"use client"

import { EventCard } from "@/components/event-card"
import { PerformerCard } from "@/components/performer-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function FollowingPage() {
  // フォロー中の出演者データ
  const performers = [
    {
      id: 1,
      name: "天野 しずく",
      occupation: "声優",
      agency: "ドリームボイス",
      image: "/images/performer-1.jpeg",
    },
    {
      id: 2,
      name: "早乙女 みなと",
      occupation: "声優",
      agency: "ステラボイス",
      image: "/images/performer-2.jpeg",
    },
    {
      id: 3,
      name: "有栖川 りお",
      occupation: "声優",
      agency: "ムーンライト",
      image: "/images/performer-3.jpeg",
    },
  ]

  // フォロー中の出演者のイベントデータ
  const events = [
    {
      id: 1,
      title: "サマーフェス2025",
      date: "2025-07-20",
      location: "さいたまスーパーアリーナ",
      image: "/images/concert.png",
      performers: ["天野 しずく", "早乙女 みなと"],
    },
    {
      id: 2,
      title: "5周年ライブin横アリ",
      date: "2025-07-26",
      location: "横浜アリーナ",
      image: "/images/concert-lights.jpeg",
      performers: ["有栖川 りお"],
    },
    {
      id: 3,
      title: "生誕祭2025",
      date: "2025-07-27",
      location: "サイエンスホール",
      image: "/images/concert-audience.jpeg",
      performers: ["天野 しずく"],
    },
  ]

  return (
    <div className="space-y-5">
      <motion.h1
        className="text-xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        フォロー中
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
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
      </motion.div>
    </div>
  )
}
