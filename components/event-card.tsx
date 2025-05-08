import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatedCard } from "./animated-card"

interface EventCardProps {
  event: {
    id: number
    title: string
    date: string
    location: string
    image: string
    performers?: string[]
  }
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <AnimatedCard delay={index}>
      <Link href={`/events/${event.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md w-full">
          <div className="relative">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={400}
              height={200}
              className="w-full h-40 object-cover object-center"
              priority={index < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <CardContent className="p-4 relative -mt-10 bg-gradient-to-t from-background to-background/95 rounded-t-2xl">
            <h2 className="font-bold text-base mb-2">{event.title}</h2>
            <div className="flex flex-col gap-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-primary" />
                <span className="text-xs">{new Date(event.date).toLocaleDateString("ja-JP")}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-3 w-3 text-primary" />
                <span className="text-xs">{event.location}</span>
              </div>
              {event.performers && (
                <div className="mt-1 text-xs">
                  <span className="text-primary font-medium">出演:</span> {event.performers.join(", ")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </AnimatedCard>
  )
}
