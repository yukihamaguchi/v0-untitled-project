"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BanknoteIcon, CheckCircle, BookOpenIcon } from "lucide-react"
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ripple-button"
import { useRouter } from "next/navigation"
import { saveGifting } from "@/app/actions/gifting-actions"
import { getUserSession } from "@/utils/auth"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZES } from "@/lib/constants"
import { getWritableArea } from "@/lib/utils/message-layout"
import { calculateTotalPoints } from "@/lib/utils/points"
import type { RecipientMessage } from "@/types/message"
import type { Recipient } from "@/types/recipient"

interface ConfirmPageProps {
  params: {
    id: string
  }
}

export default function ConfirmPage({ params }: ConfirmPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const eventId = Number.parseInt(params.id)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [paymentInfo, setPaymentInfo] = useState<{
    eventId: number
    messages: RecipientMessage[]
    totalAmount: number
  } | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([])

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

    const info = sessionStorage.getItem("paymentInfo")
    if (info) {
      const parsed = JSON.parse(info)
      setPaymentInfo(parsed)

      // Fetch recipient details
      const recipientIds = JSON.parse(sessionStorage.getItem("selectedRecipients") || "[]")
      const allRecipients: Recipient[] = [
        {
          id: "organizer-1",
          name: "イベント主催者",
          role: "organizer",
          image: "/images/organizer.jpg",
        },
        {
          id: "performer-1",
          name: "天野 しずく",
          role: "performer",
          occupation: "声優",
          agency: "ドリームボイス",
          image: "/images/performer-1.jpeg",
        },
        {
          id: "performer-2",
          name: "早乙女 みなと",
          role: "performer",
          occupation: "声優",
          agency: "ステラボイス",
          image: "/images/performer-2.jpeg",
        },
        {
          id: "performer-3",
          name: "有栖川 りお",
          role: "performer",
          occupation: "声優",
          agency: "ムーンライト",
          image: "/images/performer-3.jpeg",
        },
        {
          id: "performer-4",
          name: "白石 ほのか",
          role: "performer",
          occupation: "声優",
          agency: "サンシャイン",
          image: "/images/performer-4.jpeg",
        },
      ]
      const selected = allRecipients.filter((r) => recipientIds.includes(r.id))
      setRecipients(selected)
    } else {
      router.push(`/events/${eventId}/recipients`)
    }
  }, [eventId, router, toast])

  const handleConfirm = async () => {
    if (isSubmitting || !paymentInfo) return
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

      // Save each message
      for (const message of paymentInfo.messages) {
        const recipient = recipients.find((r) => r.id === message.recipientId)
        if (!recipient) continue

        const messagePoints = calculateTotalPoints(message.selectedFrame || "none", message.selectedStamps || [])

        const result = await saveGifting({
          user_id: session.email,
          user_name: session.name,
          artist_id: message.recipientId,
          artist_name: recipient.name,
          event_id: eventId,
          event_name: event.title,
          amount: messagePoints,
          comment: message.comment || "",
          page_size: message.pageSize || "full",
          frame_type: message.selectedFrame || "none",
          frame_points: 0,
          stamps: message.selectedStamps || [],
          stamp_points: (message.selectedStamps?.length || 0) * 500,
          sender_name: session.name,
          sender_avatar: session.avatar || "/images/default-avatar.jpg",
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
      }

      toast({
        title: "送信完了",
        description: "メッセージを送信しました",
      })

      sessionStorage.setItem(
        "completedPaymentInfo",
        JSON.stringify({
          recipientCount: paymentInfo.messages.length,
          totalAmount: paymentInfo.totalAmount,
        }),
      )

      setTimeout(() => {
        sessionStorage.removeItem("paymentInfo")
        sessionStorage.removeItem("selectedRecipients")
        router.push(`/events/${eventId}/thanks`)
      }, 500)
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

  if (!paymentInfo || recipients.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  return (
    <div className="space-y-5 min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="flex items-center mb-2">
        <Link href={`/events/${eventId}/send`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-white/70">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">メッセージ確認</h1>
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

            <h2 className="text-center text-lg font-bold">送信内容の確認</h2>
            <p className="text-center text-sm text-muted-foreground">
              以下の内容でメッセージを送信します。よろしければ「送信する」ボタンを押してください。
            </p>

            {/* Display each recipient's message */}
            {paymentInfo.messages.map((message, index) => {
              const recipient = recipients.find((r) => r.id === message.recipientId)
              if (!recipient) return null

              const pageSizeLabel = PAGE_SIZES.find((s) => s.value === message.pageSize)?.label || "1ページ"
              const writableArea = getWritableArea((message.pageSize as any) || "full")
              const messagePoints = calculateTotalPoints(message.selectedFrame || "none", message.selectedStamps || [])

              return (
                <div key={message.recipientId} className="border-t pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-3">
                    {recipient.role === "organizer" ? (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <BookOpenIcon className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <img
                        src={recipient.image || "/placeholder.svg"}
                        alt={recipient.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{recipient.name}</p>
                      {recipient.role === "performer" && (
                        <p className="text-xs text-muted-foreground truncate">
                          {recipient.occupation} · {recipient.agency}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative w-full aspect-square max-w-sm mx-auto mb-3">
                    <div
                      className="absolute inset-0 rounded-lg shadow-2xl border-2 border-gray-200 overflow-visible"
                      style={{
                        backgroundImage: "url(/images/page-background.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-200/50 to-transparent z-[5]"></div>

                      <div
                        className="absolute p-3 overflow-hidden bg-white z-[1]"
                        style={{
                          width: writableArea.width,
                          height: writableArea.height,
                          top: writableArea.top,
                          left: writableArea.left,
                        }}
                      >
                        <div
                          className="w-full text-sm leading-relaxed font-serif whitespace-pre-wrap break-words relative z-10"
                          style={{ color: message.comment ? "#7c3aed" : "#94a3b8" }}
                        >
                          {message.comment || "(メッセージなし)"}
                        </div>
                      </div>

                      {message.selectedStamps && message.selectedStamps.length > 0 && (
                        <div
                          className="absolute flex gap-1 items-center justify-center flex-wrap px-2"
                          style={{
                            width: writableArea.width,
                            left: writableArea.left,
                            bottom: `calc(100% - ${writableArea.top} - ${writableArea.height} + 8px)`,
                            zIndex: 30,
                          }}
                        >
                          {message.selectedStamps.map((stampEmoji, i) => (
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

                      <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-serif z-[5] leading-none scale-y-50 origin-bottom">
                        {pageSizeLabel}
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-3 rounded-lg space-y-2">
                    {message.comment && (
                      <div className="flex flex-col gap-1 text-sm pb-2 border-b">
                        <span className="text-muted-foreground">メッセージ</span>
                        <div className="bg-white p-2 rounded border text-sm whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                          {message.comment}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ページサイズ</span>
                      <span className="font-medium">{pageSizeLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">スタンプ購入で貢献</span>
                      <span className="font-medium">
                        {message.selectedStamps && message.selectedStamps.length > 0
                          ? `⭐ × ${message.selectedStamps.length}`
                          : "なし"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ポイント</span>
                      <div className="flex items-center gap-1">
                        <BanknoteIcon className="h-4 w-4 text-primary" />
                        <span className="text-lg font-bold text-primary">{messagePoints.toLocaleString()}pt</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold">合計ポイント</span>
                <div className="flex items-center gap-1">
                  <BanknoteIcon className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">{paymentInfo.totalAmount.toLocaleString()}pt</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">{recipients.length}人にメッセージを送信</p>
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
            <Link href={`/events/${eventId}/send`} className="w-full">
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
