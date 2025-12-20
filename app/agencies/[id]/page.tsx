"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Building2, ChevronLeft, Globe, Heart } from "lucide-react"
import { ArtistCard } from "@/components/artist-card"
import { getAgencyById, getArtistsByAgency } from "@/lib/agencies-data"

interface AgencyPageProps {
  params: {
    id: string
  }
}

export default function AgencyPage({ params }: AgencyPageProps) {
  const agency = getAgencyById(params.id)
  const artists = getArtistsByAgency(params.id)

  if (!agency) {
    return (
      <div className="space-y-5">
        <div className="text-center py-12">
          <p className="text-muted-foreground">事務所が見つかりませんでした</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">事務所詳細</h1>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="relative">
          {agency.logo_url ? (
            <Image
              src={agency.logo_url || "/placeholder.svg"}
              alt={agency.name}
              width={400}
              height={200}
              unoptimized
              className="w-full h-40 object-contain bg-white"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Building2 className="h-20 w-20 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <CardContent className="p-4 relative -mt-12 bg-gradient-to-t from-background to-background/95 rounded-t-2xl">
          <h2 className="font-bold text-lg mb-3">{agency.name}</h2>

          {agency.website_url && (
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-3 w-3 text-primary" />
              <a
                href={agency.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                公式サイト
              </a>
            </div>
          )}

          {agency.description && <p className="text-xs text-muted-foreground leading-relaxed">{agency.description}</p>}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-4">
          <Link href={`/agencies/${params.id}/support`}>
            <Button className="w-full gap-2 rounded-full h-11">
              <Heart className="h-4 w-4" />
              この事務所をサポートする
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-bold mb-3">所属アーティスト</h2>
        {artists.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">所属アーティストはまだ登録されていません</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} agencyId={params.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
