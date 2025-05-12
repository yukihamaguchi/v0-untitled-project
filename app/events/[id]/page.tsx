import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PerformerCard } from "@/components/performer-card"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, ChevronLeft, MapPinIcon } from "lucide-react"

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const eventId = Number.parseInt(params.id)

  // イベントデータ
  const events = {
    "1": {
      id: 1,
      title: "サマーフェス2025",
      date: "2025-07-20",
      location: "さいたまスーパーアリーナ",
      description: "2025年夏最大の音楽フェスティバル。様々なジャンルのアーティストが集結します。",
      image: "/images/concert.png",
    },
    "2": {
      id: 2,
      title: "5周年ライブin横アリ",
      date: "2025-07-26",
      location: "横浜アリーナ",
      description: "デビュー5周年を記念した特別ライブイベント。豪華ゲストも多数出演予定。",
      image: "/images/concert-lights.jpeg",
    },
    "3": {
      id: 3,
      title: "生誕祭2025",
      date: "2025-07-27",
      location: "サイエンスホール",
      description: "アーティスト生誕を祝う特別なイベント。ファン感謝祭としても位置づけられています。",
      image: "/images/concert-audience.jpeg",
    },
  }

  const event = events[params.id as keyof typeof events] || events["1"]

  // 出演者データ
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
    {
      id: 4,
      name: "白石 ほのか",
      occupation: "声優",
      agency: "サンシャイン",
      image: "/images/performer-4.jpeg",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">イベント詳細</h1>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="relative">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={200}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <CardContent className="p-4 relative -mt-12 bg-gradient-to-t from-background to-background/95 rounded-t-2xl">
          <h2 className="font-bold text-lg mb-3">{event.title}</h2>

          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3 text-primary" />
              <span className="text-xs">{new Date(event.date).toLocaleDateString("ja-JP")}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3 text-primary" />
              <span className="text-xs">{event.location}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{event.description}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-bold mb-3">出演者</h2>
        <div className="grid grid-cols-2 gap-3">
          {performers.map((performer) => (
            <PerformerCard key={performer.id} performer={performer} eventId={eventId} />
          ))}
        </div>
      </div>
    </div>
  )
}
