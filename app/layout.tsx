import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

// メタデータはクライアントコンポーネントでは使用できないため、別途定義
export const metadata: Metadata = {
  title: "投げ銭アプリ",
  description: "イベントの演者に投げ銭ができるアプリ",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'