"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavigation } from "@/components/bottom-navigation"
import { PageTransition } from "@/components/page-transition"
import { useEffect, useState } from "react"
import { getUserSession } from "@/utils/auth"
import { usePathname, useRouter } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 認証が必要なページのパス
    const authRequiredPaths = ["/", "/events", "/following", "/profile", "/events/"]

    // 現在のパスが認証が必要なパスかどうかをチェック
    const isAuthRequired = authRequiredPaths.some((path) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path),
    )

    // アーティスト関連のパスかどうかをチェック
    const isArtistPath = pathname.startsWith("/artist")

    // ログインページかどうかをチェック
    const isLoginPage = pathname === "/login" || pathname === "/artist/login"

    if (isAuthRequired && !isLoginPage) {
      // セッション情報を取得
      const session = getUserSession()
      if (!session) {
        // ログインしていない場合はログインページにリダイレクト
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    } else if (isArtistPath && !pathname.includes("/login")) {
      // アーティスト関連のページの場合は、アーティストセッションをチェック
      const session = getUserSession()
      if (!session || session.role !== "artist") {
        // アーティストでない場合はアーティストログインページにリダイレクト
        router.push("/artist/login")
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [pathname, router])

  // ログインページとアーティストログインページの場合はボトムナビゲーションを表示しない
  const showBottomNav = pathname !== "/login" && pathname !== "/artist/login" && !pathname.startsWith("/artist/")

  if (isLoading) {
    return (
      <html lang="ja" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 px-4 pb-20 mx-auto w-full max-w-md">
              <PageTransition>
                <div className="py-4">{children}</div>
              </PageTransition>
            </main>
            {showBottomNav && <BottomNavigation />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
