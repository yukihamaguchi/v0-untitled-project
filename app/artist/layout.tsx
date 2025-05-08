import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "アーティストポータル | ギフティングアプリ",
  description: "アーティスト向けギフティング管理ポータル",
}

export default function ArtistLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-background">{children}</div>
}
