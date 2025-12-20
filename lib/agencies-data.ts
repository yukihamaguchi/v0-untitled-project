export interface Agency {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
}

export interface Artist {
  id: string
  name: string
  bio: string | null
  image_url: string | null
  genre: string | null
  agency_id: string
}

export interface SupportTier {
  value: string
  label: string
  amount: number
  benefits: string[]
}

export const agencies: Agency[] = [
  {
    id: "japan-arts",
    name: "ジャパン・アーツ",
    description:
      "1976年の創立以来「真の芸術にふれた感動は、人々に生きる力を与えてくれる」という理念のもと、日本と世界のアーティストたちによる最高の芸術を紹介",
    logo_url: "/images/image.png",
    website_url: "https://www.japanarts.co.jp",
  },
]

export const supportTiers: SupportTier[] = [
  {
    value: "5000",
    label: "A. ¥5,000以上",
    amount: 5000,
    benefits: ["ご芳名記載サンクスカード発送"],
  },
  {
    value: "30000",
    label: "B. ¥30,000以上",
    amount: 30000,
    benefits: [
      "ご芳名記載サンクスカード発送",
      "第19回 ショパン国際ピアノ・コンクール 2025 入賞者ガラ・コンサートのリハーサル見学ご招待",
    ],
  },
  {
    value: "50000",
    label: "C. ¥50,000以上",
    amount: 50000,
    benefits: [
      "ご芳名記載サンクスカード発送",
      "第19回 ショパン国際ピアノ・コンクール 2025 入賞者ガラ・コンサートのリハーサル見学ご招待",
      "第19回 ショパン国際ピアノ・コンクール 2025 入賞者との交流会ご招待",
    ],
  },
  {
    value: "100000",
    label: "D. ¥100,000以上",
    amount: 100000,
    benefits: [
      "ご芳名記載サンクスカード発送",
      "第19回 ショパン国際ピアノ・コンクール 2025 入賞者ガラ・コンサートのリハーサル見学ご招待",
      "第19回 ショパン国際ピアノ・コンクール 2025 入賞者との交流会ご招待",
      "第19回 ショパン国際ピアノ・コンクール 2025 記者会見参加権",
    ],
  },
]

export const artistSupportTiers: SupportTier[] = [
  {
    value: "3000",
    label: "A. ¥3,000以上",
    amount: 3000,
    benefits: ["アーティストからの感謝メッセージ"],
  },
  {
    value: "10000",
    label: "B. ¥10,000以上",
    amount: 10000,
    benefits: ["アーティストからの感謝メッセージ", "限定コンテンツへのアクセス"],
  },
  {
    value: "30000",
    label: "C. ¥30,000以上",
    amount: 30000,
    benefits: ["アーティストからの感謝メッセージ", "限定コンテンツへのアクセス", "オンライン交流会ご招待"],
  },
  {
    value: "50000",
    label: "D. ¥50,000以上",
    amount: 50000,
    benefits: [
      "アーティストからの感謝メッセージ",
      "限定コンテンツへのアクセス",
      "オンライン交流会ご招待",
      "リハーサル見学ご招待",
    ],
  },
]

export const artists: Artist[] = [
  {
    id: "artist-1",
    name: "ピアニスト A",
    bio: "世界的に活躍するピアニスト",
    image_url: "/placeholder.svg?height=200&width=200",
    genre: "クラシック",
    agency_id: "japan-arts",
  },
  {
    id: "artist-2",
    name: "バイオリニスト B",
    bio: "国際コンクール優勝者",
    image_url: "/placeholder.svg?height=200&width=200",
    genre: "クラシック",
    agency_id: "japan-arts",
  },
]

export function getAgencyById(id: string): Agency | undefined {
  return agencies.find((agency) => agency.id === id)
}

export function getArtistsByAgency(agencyId: string): Artist[] {
  return artists.filter((artist) => artist.agency_id === agencyId)
}

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id)
}
