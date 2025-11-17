"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, BanknoteIcon } from "lucide-react"
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ripple-button"

interface ThanksPageProps {
  params: {
    id: string
  }
}

export default function ThanksPage({ params }: ThanksPageProps) {
  const eventId = Number.parseInt(params.id)
  const [messageInfo, setMessageInfo] = useState<{
    recipientCount: number
    totalAmount: number
  } | null>(null)

  useEffect(() => {
    // セッションストレージから情報を取得
    const info = sessionStorage.getItem("completedPaymentInfo")
    if (info) {
      const parsed = JSON.parse(info)
      setMessageInfo({
        recipientCount: parsed.recipientCount,
        totalAmount: parsed.totalAmount,
      })
      // 情報をクリア
      sessionStorage.removeItem("completedPaymentInfo")
      sessionStorage.removeItem("paymentInfo")
      sessionStorage.removeItem("selectedRecipients")
    }
  }, [])

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md"
      >
        <Card className="w-full border-none shadow-lg overflow-hidden">
          <CardContent className="pt-8 pb-5 flex flex-col items-center text-center">
            <motion.div
              className="relative mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <div className="absolute inset-0 rounded-full bg-green-100 blur-md transform scale-110" />
              <CheckCircle className="h-16 w-16 text-green-500 relative z-10" />
            </motion.div>
            <motion.h1
              className="text-xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              ありがとうございます！
            </motion.h1>
            <motion.p
              className="text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              メッセージが送信されました。
              <br />
              あなたの応援が出演者の力になります。
            </motion.p>

            {messageInfo && (
              <motion.div
                className="bg-muted/30 rounded-lg p-4 w-full mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">送信先</span>
                  <span className="text-sm font-medium">{messageInfo.recipientCount}人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">合計ポイント</span>
                  <div className="flex items-center gap-1">
                    <BanknoteIcon className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold text-primary">{messageInfo.totalAmount.toLocaleString()}pt</span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">送信したメッセージは、出演者のデジタルブックに届きます。</p>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-4 bg-muted/20 border-t">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Link href={`/events/${eventId}`} className="w-full">
                <RippleButton className="w-full rounded-full text-sm h-9">イベントに戻る</RippleButton>
              </Link>
            </motion.div>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full rounded-full text-sm h-9 bg-white/70">
                  ホームに戻る
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
