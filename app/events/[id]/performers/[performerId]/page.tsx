import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TipForm } from "@/components/tip-form"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart } from "lucide-react"
import type { Performer } from "@/types/performer"

interface PerformerPageProps {
  params: {
    id: string
    performerId: string
  }
}

export default function PerformerPage({ params }: PerformerPageProps) {
  const resolvedParams = React.use(params)
  const eventId = Number.parseInt(resolvedParams.id)
  const performerId = Number.parseInt(resolvedParams.performerId)

  // 仮のイベントデータ
  const event = {
    id: eventId,
    title: "サマーフェス2025",
  }

  // 演者データ
  const performers: Record<string, Performer> = {
    "1": {
      id: 1,
      name: "天野 しずく",
      occupation: "声優",
      agency: "ドリームボイス",
      image: "/images/performer-1.jpeg",
      isFollowing: false,
      paypayId: "p2p01_VB6KgXvj6N25mbxs",
    },
    "2": {
      id: 2,
      name: "早乙女 みなと",
      occupation: "声優",
      agency: "ステラボイス",
      image: "/images/performer-2.jpeg",
      isFollowing: true,
      paypayId: "p2p01_VB6KgXvj6N25mbxs",
    },
    "3": {
      id: 3,
      name: "有栖川 りお",
      occupation: "声優",
      agency: "ムーンライト",
      image: "/images/performer-3.jpeg",
      isFollowing: false,
      paypayId: "p2p01_VB6KgXvj6N25mbxs",
    },
    "4": {
      id: 4,
      name: "白石 ほのか",
      occupation: "声優",
      agency: "サンシャイン",
      image: "/images/performer-4.jpeg",
      isFollowing: false,
      paypayId: "p2p01_VB6KgXvj6N25mbxs",
    },
  }

  const performer = performers[params.performerId] || performers["1"]

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href={`/events/${eventId}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">出演者詳細</h1>
      </div>

      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-md transform scale-90" />
              <Image
                src={performer.image || "/placeholder.svg"}
                alt={performer.name}
                width={100}
                height={100}
                className="rounded-full relative z-10 border-2 border-background object-cover h-[100px] w-[100px]"
              />
            </div>
            <h2 className="font-bold text-lg mb-1">{performer.name}</h2>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <span>
                {performer.occupation}（{performer.agency}）
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-1 rounded-full text-xs h-8">
              <Heart className={`h-3 w-3 ${performer.isFollowing ? "fill-primary text-primary" : ""}`} />
              {performer.isFollowing ? "フォロー中" : "フォローする"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <TipForm
        eventId={eventId}
        performerId={performerId}
        performerName={performer.name}
        paypayId={performer.paypayId}
      />
    </div>
  )
}
