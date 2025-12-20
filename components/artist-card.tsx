import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ArtistCardProps {
  artist: {
    id: string
    name: string
    bio: string | null
    image_url: string | null
    genre: string | null
  }
  agencyId: string
}

export function ArtistCard({ artist, agencyId }: ArtistCardProps) {
  return (
    <Link href={`/agencies/${agencyId}/artists/${artist.id}/support`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md">
        <div className="relative">
          {artist.image_url ? (
            <Image
              src={artist.image_url || "/placeholder.svg"}
              alt={artist.name}
              width={200}
              height={200}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <User className="h-12 w-12 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-3 relative -mt-8 bg-gradient-to-t from-background to-background/95 rounded-t-2xl">
          <h3 className="font-bold text-sm mb-1">{artist.name}</h3>
          {artist.genre && (
            <Badge variant="secondary" className="text-[10px] h-5">
              {artist.genre}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
