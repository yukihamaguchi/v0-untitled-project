"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BanknoteIcon, CheckCircle, BookOpenIcon } from "lucide-react"
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

const STAMPS = [
  { emoji: "👏", label: "拍手", points: 500 },
  { emoji: "⭐", label: "スター", points: 1000 },
  { emoji: "❤️", label: "ハート", points: 2000 },
  { emoji: "🎉", label: "クラッカー", points: 5000 },
] as const

const PAGE_SIZES = [
  { value: "full", label: "1ページ", description: "150文字まで" },
  { value: "half", label: "1/2ページ", description: "64文字まで" },
  { value: "quarter", label: "1/4ページ", description: "20文字まで" },
] as const

const FRAMES = [
  {
    value: "none",
    label: "フレームなし",
    points: 0,
    image: null,
  },
  {
    value: "flower",
    label: "フラワーフレーム",
    points: 500,
    image: "/images/frame-flower.png",
  },
  {
    value: "autumn",
    label: "オータムフレーム",
    points: 500,
    image: "/images/frame-autumn.png",
  },
] as const

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
    pageSize: string
    frameType: string
    framePoints: number
    stamps: string[]
    stampPoints: number
  } | null>(null)

  useEffect(() => {
    const session = getUserSession()
    if (session && session.role === "artist") {
      toast({
        title: "アクセス制限",
        description: "アーティストはギフティングを送信できません",
        variant: "destructive",
      })
      router.push("/artist/dashboard")
      return
    }

    const info = getPaymentInfo()
    if (info) {
      setPaymentInfo({
        performerName: info.performerName,
        amount: info.amount,
        comment: info.comment,
        pageSize: info.pageSize || "full",
        frameType: info.frameType || "none",
        framePoints: info.framePoints || 0,
        stamps: info.stamps || [],
        stampPoints: info.stampPoints || 0,
      })
    } else {
      router.push(`/events/${eventId}/performers/${performerId}`)
    }
  }, [eventId, performerId, router, toast])

  const handleConfirm = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
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

      if (session.role === "artist") {
        toast({
          title: "アクセス制限",
          description: "アーティストはギフティングを送信できません",
          variant: "destructive",
        })
        router.push("/artist/dashboard")
        return
      }

      const events = {
        "1": { id: 1, title: "サマーフェス2025" },
        "2": { id: 2, title: "5周年ライブin横アリ" },
        "3": { id: 3, title: "生誕祭2025" },
        "4": { id: 4, title: "ウィンターライブ2024" },
      }
      const event = events[params.id as keyof typeof events] || { id: eventId, title: "イベント" }

      if (paymentInfo) {
        const result = await saveGifting({
          user_id: session.email,
          user_name: session.name,
          artist_id: `artist-${performerId}`,
          artist_name: paymentInfo.performerName,
          event_id: eventId,
          event_name: event.title,
          amount: Number.parseInt(paymentInfo.amount),
          comment: paymentInfo.comment || undefined,
          page_size: paymentInfo.pageSize,
          frame_type: paymentInfo.frameType,
          frame_points: paymentInfo.framePoints,
          stamps: paymentInfo.stamps,
          stamp_points: paymentInfo.stampPoints,
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

        setTimeout(() => {
          const thanksUrl = `/events/${eventId}/performers/${performerId}/thanks`
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
  const pageSizeLabel = PAGE_SIZES.find((s) => s.value === paymentInfo.pageSize)?.label || "1ページ"
  const selectedFrameData = FRAMES.find((f) => f.value === paymentInfo.frameType) || FRAMES[0]

  const getFrameArea = () => {
    switch (paymentInfo.pageSize) {
      case "full":
        return { width: "calc(100% - 48px)", height: "calc(100% - 48px)", top: "24px", left: "24px" }
      case "half":
        return { width: "calc(100% - 48px)", height: "calc(50% - 36px)", top: "24px", left: "24px" }
      case "quarter":
        return { width: "calc(50% - 36px)", height: "calc(50% - 36px)", top: "24px", left: "24px" }
      default:
        return { width: "calc(100% - 48px)", height: "calc(100% - 48px)", top: "24px", left: "24px" }
    }
  }

  const getWritableArea = () => {
    switch (paymentInfo.pageSize) {
      case "full":
        return { width: "calc(100% - 96px)", height: "calc(100% - 96px)", top: "48px", left: "48px" }
      case "half":
        return { width: "calc(100% - 96px)", height: "calc(50% - 72px)", top: "48px", left: "48px" }
      case "quarter":
        return { width: "calc(50% - 72px)", height: "calc(50% - 72px)", top: "48px", left: "48px" }
      default:
        return { width: "calc(100% - 96px)", height: "calc(100% - 96px)", top: "48px", left: "48px" }
    }
  }

  const frameArea = getFrameArea()
  const writableArea = getWritableArea()

  return (
    <div className="space-y-5 min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="flex items-center mb-2">
        <Link href={`/events/${eventId}/performers/${performerId}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-white/70">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">デジタルブック確認</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-primary/5">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-md transform scale-110" />
                <CheckCircle className="h-12 w-12 text-primary relative z-10" />
              </div>
            </div>

            <h2 className="text-center text-lg font-bold">デジタルブック内容の確認</h2>
            <p className="text-center text-sm text-muted-foreground">
              以下の内容でデジタルブックページを送信します。よろしければ「送信する」ボタンを押してください。
            </p>

            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-1">
                <BookOpenIcon className="h-4 w-4 text-primary" />
                送信内容
              </div>
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-visible">
                  {/* Left binding effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-200/50 to-transparent z-[5]"></div>

                  {selectedFrameData.image && (
                    <div
                      className="absolute pointer-events-none overflow-visible"
                      style={{
                        width: frameArea.width,
                        height: frameArea.height,
                        top: frameArea.top,
                        left: frameArea.left,
                        zIndex: 15,
                      }}
                    >
                      <img
                        src={selectedFrameData.image || "/placeholder.svg"}
                        alt={selectedFrameData.label}
                        className="w-full h-full object-cover"
                        style={{
                          imageRendering: "crisp-edges",
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="absolute p-3 overflow-hidden"
                    style={{
                      width: writableArea.width,
                      height: writableArea.height,
                      top: writableArea.top,
                      left: writableArea.left,
                      zIndex: 20,
                    }}
                  >
                    <div className="w-full h-full text-sm leading-relaxed font-serif whitespace-pre-wrap break-words">
                      {paymentInfo.comment || "メッセージなし"}
                    </div>
                  </div>

                  {paymentInfo.stamps.length > 0 && (
                    <div
                      className="absolute flex gap-1 items-center justify-center flex-wrap px-2"
                      style={{
                        width: writableArea.width,
                        left: writableArea.left,
                        bottom: `calc(100% - ${writableArea.top} - ${writableArea.height} + 8px)`,
                        zIndex: 30,
                      }}
                    >
                      {paymentInfo.stamps.map((stampEmoji, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-xl drop-shadow-lg"
                        >
                          {stampEmoji}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Page size label */}
                  <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-serif z-[5]">
                    {pageSizeLabel}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ページサイズ</span>
                <span className="font-medium">{pageSizeLabel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">フレーム</span>
                <span className="font-medium">{selectedFrameData.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ギフティングスタンプ</span>
                <span className="font-medium">
                  {paymentInfo.stamps.length > 0 ? paymentInfo.stamps.join(" ") : "なし"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">合計ポイント</span>
                <div className="flex items-center gap-1">
                  <BanknoteIcon className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{amount.toLocaleString()}pt</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-4 bg-muted/20 border-t">
            <RippleButton
              onClick={handleConfirm}
              className="w-full gap-1 rounded-full h-9 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "処理中..." : "送信する"}
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
