import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, ChevronRightIcon, MapPinIcon, MessageSquareIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ArtistEventCardProps {
  event: {
    id: number
    title: string
    date: string
    location: string
    image: string
    totalGifting: number
    messageCount: number
  }
}

export function ArtistEventCard({ event }: ArtistEventCardProps) {
  return (
    <Link href={`/artist/events/${event.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 h-32 md:h-auto">
            <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base mb-2">{event.title}</h3>
                <div className="flex flex-col gap-1 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3 text-primary" />
                    <span className="text-xs">{new Date(event.date).toLocaleDateString("ja-JP")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3 text-primary" />
                    <span className="text-xs">{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="bg-primary/10 px-2 py-1 rounded-full">
                  <p className="font-bold text-primary text-xs">¥{event.totalGifting.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquareIcon className="h-3 w-3" />
                  <span>{event.messageCount}件</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
