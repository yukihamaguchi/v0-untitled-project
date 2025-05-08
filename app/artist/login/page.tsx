"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { MicIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { saveUserSession } from "@/utils/auth"

export default function ArtistLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // アーティスト認証のチェック
    if (email === "artist@example.com" && password === "P@ssw0rd") {
      // アーティストセッションを保存
      saveUserSession({
        email,
        role: "artist",
        name: "天野 しずく",
      })

      // アーティストダッシュボードにリダイレクト
      setTimeout(() => {
        setIsLoading(false)
        router.push("/artist/dashboard")
      }, 1000)
    } else {
      // エラーメッセージを表示
      setTimeout(() => {
        setIsLoading(false)
        setError("メールアドレスまたはパスワードが正しくありません。")
      }, 1000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <MicIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">アーティストポータル</h1>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">ログイン</CardTitle>
            <CardDescription>アーティストアカウントでログインしてください</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">パスワード</Label>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    パスワードを忘れた場合
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
              <div className="text-center text-sm text-muted-foreground mt-2">
                ユーザーの方は
                <Link href="/login" className="text-primary hover:underline ml-1">
                  こちら
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
