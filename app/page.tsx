"use client"

import { AgencyCard } from "@/components/agency-card"

interface Agency {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
}

const agencies: Agency[] = [
  {
    id: "japan-arts",
    name: "ジャパン・アーツ",
    description:
      "1976年の創立以来「真の芸術にふれた感動は、人々に生きる力を与えてくれる」という理念のもと、日本と世界のアーティストたちによる最高の芸術を紹介",
    logo_url: "/images/image.png",
    website_url: "https://www.japanarts.co.jp",
  },
]

export default function Home() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">事務所一覧</h1>

      <div className="space-y-6">
        {agencies.map((agency, index) => (
          <AgencyCard key={agency.id} agency={agency} index={index} />
        ))}
      </div>
    </div>
  )
}
