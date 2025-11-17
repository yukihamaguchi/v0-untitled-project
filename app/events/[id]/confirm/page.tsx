"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BanknoteIcon, CheckCircle, BookOpenIcon } from 'lucide-react'
import { motion } from "framer-motion"
import { RippleButton } from "@/components/ripple-button"
import { useRouter } from 'next/navigation'
import { saveGifting } from "@/app/actions/gifting-actions"
import { getUserSession } from "@/utils/auth"
import { useToast } from "@/hooks/use-toast"
import { getWritableArea } from "@/lib/utils/message-layout"
import { calculateTotalPoints } from "@/lib/utils/points"
import Image from "next/image"
import type { RecipientMessage } from "@/types/message"
import type { Recipient } from "@/types/recipient"
import { STAMPS } from "@/lib/constants"

interface ConfirmPageProps {
  params: {
    id: string
  }
}

export default function ConfirmPage({ params }: ConfirmPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [eventId, setEventId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [paymentInfo, setPaymentInfo] = useState<{
    eventId: number
    messages: RecipientMessage[]
    totalAmount: number
    hasFrame?: boolean
  } | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([])

  useEffect(() => {
    const id = Number.parseInt(params.id)
    setEventId(id)
    
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

      const allRecipients: Recipient[] = [
        {
          id: "organizer-1",
          name: "イベント主催者",
          role: "organizer",
          image: "/images/organizer.jpg",
        },
        {
          id: "performer-1",
          name: "河西健吾",
          role: "performer",
          occupation: "声優",
          agency: "マウスプロモーション",
          image: "/images/performer-1.jpeg",
        },
        {
          id: "performer-2",
          name: "高塚智人",
          role: "performer",
          occupation: "声優",
          agency: "マウスプロモーション",
          image: "/images/performer-2.jpeg",
        },
      ]
      
      const recipientIds = parsed.messages.map((m: RecipientMessage) => m.recipientId)
      const selected = allRecipients.filter((r) => recipientIds.includes(r.id))
      setRecipients(selected)
    } else {
      router.push(`/events/${id}/recipients`)
    }
  }, [params, router, toast])

  const getFrameImage = (messageLength: number) => {
    if (messageLength <= 50) {
      return "/images/frame-narrow.jpg" // 細長フレーム
    } else if (messageLength <= 200) {
      return "/images/frame-standard.jpg" // 標準フレーム
    } else {
      return "/images/frame-tall.jpg" // 縦長フレーム
    }
  }

  const handleConfirm = async () => {
    if (isSubmitting || !paymentInfo || eventId === null) return
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
        "1": { id: 1, title: "【阪神店】喫茶しーぷいへようこそ！" },
        "2": { id: 2, title: "5周年ライブin横アリ" },
        "3": { id: 3, title: "生誕祭2025" },
        "4": { id: 4, title: "ウィンターライブ2024" },
      }
      const event = events[String(eventId) as keyof typeof events] || { id: eventId, title: "イベント" }

      for (const message of paymentInfo.messages) {
        const recipient = recipients.find((r) => r.id === message.recipientId)
        if (!recipient) continue

        const stampPoints = message.stampCart
          ? Object.entries(message.stampCart).reduce((sum, [emoji, quantity]) => {
              const stamp = STAMPS.find((s) => s.emoji === emoji)
              return sum + (stamp ? stamp.points * quantity : 0)
            }, 0)
          : 0

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
          frame_type: message.selectedFrame || "none",
          frame_points: 0,
          stamps: message.selectedStamps || [],
          stamp_points: stampPoints,
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

  if (!paymentInfo || eventId === null) {
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

            {paymentInfo.messages.map((message, index) => {
              const recipient = recipients.find((r) => r.id === message.recipientId)
              if (!recipient) return null

              const writableArea = getWritableArea()
              const messagePoints = calculateTotalPoints(message.selectedFrame || "none", message.selectedStamps || [])
              const frameImage = getFrameImage(message.comment?.length || 0)

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

                  <div className="relative w-full aspect-[4/3] max-w-md mx-auto mb-3">
                    {paymentInfo.hasFrame ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={frameImage || "/placeholder.svg"}
                          alt="メッセージフレーム"
                          fill
                          className="object-contain"
                        />
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center p-8"
                          style={{
                            top: "12%",
                            left: "8%",
                            right: "8%",
                            bottom: "12%",
                          }}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-center text-amber-900 mb-4 max-h-[60%] overflow-auto">
                            {message.comment || "(メッセージなし)"}
                          </div>
                          
                          {message.selectedStamps && message.selectedStamps.length > 0 && (
                            <div className="flex gap-1 items-center justify-center flex-wrap">
                              {message.selectedStamps.map((stampEmoji, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0, rotate: -20 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="text-2xl drop-shadow-lg"
                                >
                                  {stampEmoji}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full border-2 border-gray-200 rounded-lg bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-center text-gray-700 mb-4">
                          {message.comment || "(メッセージなし)"}
                        </div>
                        
                        {message.selectedStamps && message.selectedStamps.length > 0 && (
                          <div className="flex gap-1 items-center justify-center flex-wrap">
                            {message.selectedStamps.map((stampEmoji, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="text-2xl drop-shadow-lg"
                              >
                                {stampEmoji}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-primary/5 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">スタンプをオーダーして貢献</span>
                      <span className="font-medium">
                        {message.selectedStamps && message.selectedStamps.length > 0
                          ? `⭐ × ${message.selectedStamps.length}`
                          : "なし"}
                      </span>
                    </div>
                    {paymentInfo.hasFrame && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">フレーム購入</span>
                        <span className="font-medium">あり (500pt)</span>
                      </div>
                    )}
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
