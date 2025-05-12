"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BanknoteIcon, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ripple-button"
import { getPaymentInfo } from "@/utils/payment"
import { useRouter } from "next/navigation"

interface ConfirmPageProps {
  params: {
    id: string
    performerId: string
  }
}

export default function ConfirmPage({ params }: ConfirmPageProps) {
  const router = useRouter()
  const eventId = Number.parseInt(params.id)
  const performerId = Number.parseInt(params.performerId)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [paymentInfo, setPaymentInfo] = useState<{
    performerName: string
    amount: string
    comment: string
  } | null>(null)

  useEffect(() => {
    // 支払い情報を取得
    const info = getPaymentInfo()
    if (info) {
      setPaymentInfo({
        performerName: info.performerName,
        amount: info.amount,
        comment: info.comment,
      })
    } else {
      // 支払い情報がない場合は前のページに戻る
      router.push(`/events/${eventId}/performers/${performerId}`)
    }
  }, [eventId, performerId, router])

  const handleConfirm = () => {
    setIsSubmitting(true)
    // 少し遅延を入れて、ユーザーに処理中であることを示す
    setTimeout(() => {
      setIsSubmitting(false)
      // 完了画面に遷移
      router.push(`/events/${eventId}/performers/${performerId}/thanks`)
    }, 1000)
  }

  if (!paymentInfo) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href={`/events/${eventId}/performers/${performerId}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">ギフティング確認</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-md transform scale-110" />
                <CheckCircle className="h-12 w-12 text-primary relative z-10" />
              </div>
            </div>

            <h2 className="text-center text-lg font-bold">ギフティング内容の確認</h2>
            <p className="text-center text-sm text-muted-foreground">
              以下の内容でギフティングを送信します。よろしければ「ギフティングする」ボタンを押してください。
            </p>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">出演者</span>
                <span className="font-medium">{paymentInfo.performerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">金額</span>
                <div className="flex items-center gap-1">
                  <BanknoteIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{Number.parseInt(paymentInfo.amount).toLocaleString()}円</span>
                </div>
              </div>
              {paymentInfo.comment && (
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">コメント</span>
                  <p className="text-sm bg-white/50 p-3 rounded">{paymentInfo.comment}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-4 bg-muted/20 border-t">
            <RippleButton
              onClick={handleConfirm}
              className="w-full gap-1 rounded-full h-9 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "処理中..." : "ギフティングする"}
            </RippleButton>
            <Link href={`/events/${eventId}/performers/${performerId}`} className="w-full">
              <Button variant="outline" className="w-full rounded-full text-sm h-9">
                修正する
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
