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
import { saveGifting } from "@/app/actions/gifting-actions"
import { getUserSession } from "@/utils/auth"
import { useToast } from "@/hooks/use-toast"

interface ConfirmPageProps {
  params: {
    id: string
    performerId: string
  }
}

// 金額に応じた色とラベルを取得する関数（tip-form.tsxと同じ）
const getAmountStyle = (amount: number) => {
  if (amount >= 10000) {
    return {
      backgroundColor: "rgb(239 68 68)", // red-500
      borderColor: "rgb(220 38 38)", // red-600
      textColor: "text-white",
      label: "¥10,000+",
      gradient: "from-red-500 to-red-600",
      cardGradient: "from-red-50 to-red-100",
      headerBg: "bg-red-500/20",
      footerBg: "bg-red-500/10",
    }
  } else if (amount >= 5000) {
    return {
      backgroundColor: "rgb(236 72 153)", // pink-500 (マゼンダ)
      borderColor: "rgb(219 39 119)", // pink-600
      textColor: "text-white",
      label: "¥5,000+",
      gradient: "from-pink-500 to-pink-600",
      cardGradient: "from-pink-50 to-pink-100",
      headerBg: "bg-pink-500/20",
      footerBg: "bg-pink-500/10",
    }
  } else if (amount >= 2000) {
    return {
      backgroundColor: "rgb(249 115 22)", // orange-500
      borderColor: "rgb(234 88 12)", // orange-600
      textColor: "text-white",
      label: "¥2,000+",
      gradient: "from-orange-500 to-orange-600",
      cardGradient: "from-orange-50 to-orange-100",
      headerBg: "bg-orange-500/20",
      footerBg: "bg-orange-500/10",
    }
  } else if (amount >= 1000) {
    return {
      backgroundColor: "rgb(234 179 8)", // yellow-500
      borderColor: "rgb(202 138 4)", // yellow-600
      textColor: "text-black",
      label: "¥1,000+",
      gradient: "from-yellow-400 to-yellow-500",
      cardGradient: "from-yellow-50 to-yellow-100",
      headerBg: "bg-yellow-500/20",
      footerBg: "bg-yellow-500/10",
    }
  } else {
    return {
      backgroundColor: "rgb(255 255 255)", // white
      borderColor: "rgb(229 231 235)", // gray-200
      textColor: "text-gray-800",
      label: "無料",
      gradient: "from-gray-50 to-white",
      cardGradient: "from-gray-50 to-white",
      headerBg: "bg-primary/5",
      footerBg: "bg-muted/20",
    }
  }
}

export default function ConfirmPage({ params }: ConfirmPageProps) {
  const router = useRouter()
  const { toast } = useToast()
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

  const handleConfirm = async () => {
    if (isSubmitting) return // 二重送信防止
    setIsSubmitting(true)

    try {
      // ユーザーセッションを取得
      const session = getUserSession()
      if (!session) {
        toast({
          title: "エラー",
          description: "ログインが必要です",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // イベント情報を取得（実際のアプリではAPIから取得するか、状態管理で保持する）
      const events = {
        "1": { id: 1, title: "サマーフェス2025" },
        "2": { id: 2, title: "5周年ライブin横アリ" },
        "3": { id: 3, title: "生誕祭2025" },
        "4": { id: 4, title: "ウィンターライブ2024" },
      }
      const event = events[params.id as keyof typeof events] || { id: eventId, title: "イベント" }

      if (paymentInfo) {
        // ギフティングデータを保存
        const result = await saveGifting({
          user_id: session.email,
          user_name: session.name,
          artist_id: `artist-${performerId}`, // 実際のアプリではアーティストの実際のIDを使用
          artist_name: paymentInfo.performerName,
          event_id: eventId,
          event_name: event.title,
          amount: Number.parseInt(paymentInfo.amount),
          comment: paymentInfo.comment || undefined,
        })

        if (!result.success) {
          toast({
            title: "エラー",
            description: result.error || "ギフティングの保存に失敗しました",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        // 完了画面に遷移する前に少し遅延を入れる
        setTimeout(() => {
          // 完了画面に遷移
          const thanksUrl = `/events/${eventId}/performers/${performerId}/thanks`
          console.log("Navigating to:", thanksUrl)
          router.push(thanksUrl)
        }, 500)
      }
    } catch (error) {
      console.error("Error saving gifting:", error)
      toast({
        title: "エラー",
        description: "ギフティングの処理中にエラーが発生しました",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (!paymentInfo) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  const amount = Number.parseInt(paymentInfo.amount)
  const amountStyle = getAmountStyle(amount)

  return (
    <div className={`space-y-5 min-h-screen bg-gradient-to-br ${amountStyle.cardGradient} p-4`}>
      <div className="flex items-center mb-2">
        <Link href={`/events/${eventId}/performers/${performerId}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-white/70">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">ギフティング確認</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-none shadow-lg bg-white/90 backdrop-blur-sm">
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

            {/* メッセージプレビュー */}
            <div>
              <div className="text-sm font-medium mb-2">送信内容</div>
              <motion.div
                className={`relative p-4 rounded-lg border-2 bg-gradient-to-br ${amountStyle.gradient} shadow-md`}
                style={{
                  borderColor: amountStyle.borderColor,
                }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`font-medium text-sm ${amountStyle.textColor}`}>
                    {paymentInfo.performerName}さんへ
                  </div>
                  <div className={`flex items-center gap-1 ${amountStyle.textColor}`}>
                    <BanknoteIcon className="h-3 w-3" />
                    <span className="text-xs font-bold">¥{amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`text-sm ${amountStyle.textColor}`}>{paymentInfo.comment || "メッセージなし"}</div>
                {/* 便箋風の装飾 */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/20"></div>
                </div>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className={`flex flex-col gap-3 p-4 ${amountStyle.footerBg} border-t`}>
            <RippleButton
              onClick={handleConfirm}
              className="w-full gap-1 rounded-full h-9 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "処理中..." : "ギフティングする"}
            </RippleButton>
            <Link href={`/events/${eventId}/performers/${performerId}`} className="w-full">
              <Button variant="outline" className="w-full rounded-full text-sm h-9 bg-white/70">
                修正する
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
