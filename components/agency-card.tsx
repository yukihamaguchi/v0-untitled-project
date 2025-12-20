import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatedCard } from "./animated-card"

interface AgencyCardProps {
  agency: {
    id: string
    name: string
    description: string | null
    logo_url: string | null
    website_url: string | null
  }
  index?: number
}

export function AgencyCard({ agency, index = 0 }: AgencyCardProps) {
  return (
    <AnimatedCard delay={index}>
      <Link href={`/agencies/${agency.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md w-full">
          <div className="relative">
            {agency.logo_url ? (
              <div className="w-full h-40 bg-white flex items-center justify-center p-4">
                <Image
                  src={agency.logo_url || "/placeholder.svg"}
                  alt={agency.name}
                  width={400}
                  height={200}
                  className="w-full h-full object-contain"
                  priority={index < 2}
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h2 className="font-bold text-base mb-2">{agency.name}</h2>
            {agency.description && <p className="text-xs text-muted-foreground line-clamp-2">{agency.description}</p>}
          </CardContent>
        </Card>
      </Link>
    </AnimatedCard>
  )
}
