import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PerformerCard } from "@/components/performer-card"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, ChevronLeft, MapPinIcon, SendIcon } from "lucide-react"

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const eventId = Number.parseInt(params.id)

  const events = {
    "1": {
      id: 1,
      title: "ヴィンセント・オン ピアノ・リサイタル",
      date: "2026-02-05",
      location: "浜離宮朝日ホール",
      description:
        "ジャパン・アーツ主催のヴィンセント・オン ピアノ・リサイタル。クラシック音楽の名曲をお楽しみください。",
      image: "/images/concert-hall.png",
    },
  }

  const event = events[params.id as keyof typeof events] || events["1"]

  const performers = [
    {
      id: 1,
      name: "ヴィンセント・オン",
      occupation: "ピアニスト",
      agency: "ジャパン・アーツ",
      image: "/images/vincent-ong.png",
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
              <span className="text-xs">
                {new Date(event.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3 text-primary" />
              <span className="text-xs">{event.location}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{event.description}</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-4">
          <Link href={`/events/${eventId}/recipients`}>
            <Button className="w-full gap-2 rounded-full h-11">
              <SendIcon className="h-4 w-4" />
              メッセージを送る
            </Button>
          </Link>
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
