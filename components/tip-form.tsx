"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import { BanknoteIcon, SendIcon } from "lucide-react"
import { motion } from "framer-motion"
import { RippleButton } from "./ripple-button"
import { savePaymentInfo } from "@/utils/payment"

interface TipFormProps {
  eventId: number
  performerId: number
  performerName: string
  paypayId: string
}

// スライダーの値を実際の金額に変換する関数
const sliderValueToAmount = (value: number): number => {
  if (value === 0) return 0
  return 1000 + (value - 1) * 100
}

// 金額をスライダーの値に変換する関数
const amountToSliderValue = (amount: number): number => {
  if (amount === 0) return 0
  return Math.floor((amount - 1000) / 100) + 1
}

// 金額に応じた色とラベルを取得する関数
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

export function TipForm({ eventId, performerId, performerName, paypayId }: TipFormProps) {
  const router = useRouter()
  // スライダーの値（0から191まで）
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // スライダーの値の範囲
  // 0 = 0円, 1 = 1000円, 2 = 1100円, ..., 191 = 20000円
  const maxSliderValue = 191 // 20000円に対応
  const minSliderValue = 0

  // 実際の金額を計算
  const amount = sliderValueToAmount(sliderValue)

  // 金額のスタイルを取得
  const amountStyle = getAmountStyle(amount)

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0])
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value
    setComment(newComment)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 支払い情報をローカルストレージに保存
    const paymentInfo = {
      eventId,
      performerId,
      performerName,
      amount: amount.toString(),
      comment,
    }
    savePaymentInfo(paymentInfo)

    // 少し遅延を入れて、ユーザーに処理中であることを示す
    setTimeout(() => {
      setIsSubmitting(false)
      // 確認画面に遷移
      router.push(`/events/${eventId}/performers/${performerId}/confirm`)
    }, 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className={`overflow-hidden border-none shadow-lg bg-gradient-to-br ${amountStyle.cardGradient}`}>
        <CardHeader className={`${amountStyle.headerBg} border-b border-primary/10 py-3 px-4`}>
          <CardTitle className="flex items-center gap-1 text-base">
            <BanknoteIcon className="h-4 w-4 text-primary" />
            ギフティングを送る
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="performer" className="text-xs font-medium">
                出演者
              </Label>
              <Input id="performer" value={performerName} disabled className="mt-1 bg-white/70 text-sm h-9" />
            </div>

            <div>
              <Label htmlFor="amount" className="text-xs font-medium mb-2 block">
                金額: ¥{amount.toLocaleString()}
              </Label>
              <div className="space-y-3">
                <Slider
                  value={[sliderValue]}
                  onValueChange={handleSliderChange}
                  max={maxSliderValue}
                  min={minSliderValue}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-center">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${amountStyle.textColor}`}
                    style={{
                      backgroundColor: amountStyle.backgroundColor,
                      borderColor: amountStyle.borderColor,
                    }}
                  >
                    {amountStyle.label}
                  </div>
                </div>
              </div>
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
                className="resize-none mt-1 text-sm bg-white/70"
                rows={3}
              />
            </div>

            {/* メッセージプレビュー */}
            <div>
              <Label className="text-xs font-medium mb-2 block">プレビュー</Label>
              <motion.div
                className={`relative p-4 rounded-lg border-2 bg-gradient-to-br ${amountStyle.gradient} shadow-md`}
                style={{
                  borderColor: amountStyle.borderColor,
                }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                key={amount} // 金額が変わるたびにアニメーションを再実行
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`font-medium text-sm ${amountStyle.textColor}`}>{performerName}さんへ</div>
                  <div className={`flex items-center gap-1 ${amountStyle.textColor}`}>
                    <BanknoteIcon className="h-3 w-3" />
                    <span className="text-xs font-bold">¥{amount.toLocaleString()}</span>
                  </div>
                </div>
                <div
                  className={`text-sm ${amountStyle.textColor} ${
                    comment ? "opacity-100" : "opacity-50"
                  } transition-opacity`}
                >
                  {comment || "メッセージを入力してください..."}
                </div>
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
          <CardFooter className={`${amountStyle.footerBg} border-t p-3`}>
            <RippleButton type="submit" className="w-full gap-1 rounded-full h-9 text-sm" disabled={isSubmitting}>
              <SendIcon className="h-3 w-3" />
              {isSubmitting ? "処理中..." : "確認画面へ"}
            </RippleButton>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
