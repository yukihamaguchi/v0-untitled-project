import { Card, CardContent } from "@/components/ui/card"
import { MicIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatedCard } from "./animated-card"

interface PerformerCardProps {
  performer: {
    id: number
    name: string
    occupation: string
    agency: string
    image: string
  }
  eventId: number
  index?: number
}

export function PerformerCard({ performer, eventId, index = 0 }: PerformerCardProps) {
  return (
    <AnimatedCard delay={index}>
      <Link href={`/events/${eventId}/performers/${performer.id}`}>
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-b from-background to-background/80">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-md transform scale-90" />
              <Image
                src={performer.image || "/placeholder.svg"}
                alt={performer.name}
                width={60}
                height={60}
                className="rounded-full relative z-10 border-2 border-background object-cover h-[60px] w-[60px]"
              />
            </div>
            <h3 className="font-medium text-sm text-center mb-1">{performer.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MicIcon className="h-3 w-3 text-primary" />
              <span>{performer.occupation}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </AnimatedCard>
  )
}
