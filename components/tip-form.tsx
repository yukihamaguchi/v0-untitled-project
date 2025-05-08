"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { BanknoteIcon, SendIcon } from "lucide-react"
import { motion } from "framer-motion"
import { RippleButton } from "./ripple-button"
import { generatePayPayLink, savePaymentInfo } from "@/utils/payment"

interface TipFormProps {
  eventId: number
  performerId: number
  performerName: string
  paypayId: string
}

export function TipForm({ eventId, performerId, performerName, paypayId }: TipFormProps) {
  const router = useRouter()
  const [amount, setAmount] = useState<string>("500")
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showEmojiWarning, setShowEmojiWarning] = useState<boolean>(false)

  const tipAmounts = ["100", "500", "1000", "3000", "5000", "10000"]

  // 絵文字が含まれているかチェック
  const checkForEmoji = (text: string) => {
    const hasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(text)
    setShowEmojiWarning(hasEmoji)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value
    setComment(newComment)
    checkForEmoji(newComment)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // データベースに保存
      const response = await fetch('/api/giftings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // 仮のユーザーID
          performerId,
          eventId,
          amount: parseInt(amount),
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save gifting')
      }

      // 支払い情報をローカルストレージに保存
      const paymentInfo = {
        eventId,
        performerId,
        performerName,
        amount,
        comment,
      }
      savePaymentInfo(paymentInfo)

    // PayPayリンクを生成（金額に応じたURLを取得）
    const payPayLink = generatePayPayLink(paypayId, amount, comment)

    // デバッグ用にコンソールに出力
    console.log("Selected amount:", amount)
    console.log("Generated PayPay link:", payPayLink)

    // 少し遅延を入れて、ユーザーに処理中であることを示す
    setTimeout(() => {
      // PayPayアプリに遷移
      window.location.href = payPayLink

      // PayPayアプリに遷移した後、ユーザーがブラウザに戻ってきたときのために
      // 少し遅延を入れてから完了画面に遷移
      setTimeout(() => {
        setIsSubmitting(false)
        router.push(`/events/${eventId}/performers/${performerId}/thanks`)
      }, 500)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-primary/5 border-b border-primary/10 py-3 px-4">
          <CardTitle className="flex items-center gap-1 text-base">
            <BanknoteIcon className="h-4 w-4 text-primary" />
            ギフティングを送る
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 p-4">
            <div>
              <Label htmlFor="performer" className="text-xs font-medium">
                出演者
              </Label>
              <Input id="performer" value={performerName} disabled className="mt-1 bg-muted/50 text-sm h-9" />
            </div>

            <div>
              <Label htmlFor="amount" className="text-xs font-medium">
                金額
              </Label>
              <RadioGroup value={amount} onValueChange={setAmount} className="grid grid-cols-3 gap-2 mt-1">
                {tipAmounts.map((value) => (
                  <motion.div key={value} whileTap={{ scale: 0.95 }} className="flex items-center">
                    <RadioGroupItem value={value} id={`amount-${value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`amount-${value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 w-full text-center transition-all text-xs"
                    >
                      {Number.parseInt(value).toLocaleString()}円
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="comment" className="text-xs font-medium">
                コメント
              </Label>
              <Textarea
                id="comment"
                placeholder="応援メッセージを入力してください"
                value={comment}
                onChange={handleCommentChange}
                className="resize-none mt-1 text-sm"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-3">
            <RippleButton type="submit" className="w-full gap-1 rounded-full h-9 text-sm" disabled={isSubmitting}>
              <SendIcon className="h-3 w-3" />
              {isSubmitting ? "処理中..." : "ギフティングする"}
            </RippleButton>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
