"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, User, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { getArtistById, artistSupportTiers } from "@/lib/agencies-data"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ArtistSupportPageProps {
  params: {
    id: string
    artistId: string
  }
}

export default function ArtistSupportPage({ params }: ArtistSupportPageProps) {
  const router = useRouter()
  const artist = getArtistById(params.artistId)

  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [namePreference, setNamePreference] = useState<"full" | "initial" | "none">("full")
  const [fullName, setFullName] = useState("")
  const [furigana, setFurigana] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const numericAmount = amount ? Number.parseInt(amount) : 0

  const getSelectedTier = (amt: number) => {
    if (amt >= 50000) return "D"
    if (amt >= 30000) return "C"
    if (amt >= 10000) return "B"
    if (amt >= 3000) return "A"
    return null
  }

  const selectedTier = getSelectedTier(numericAmount)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Artist support submitted:", {
      artist_id: params.artistId,
      amount: numericAmount,
      name_preference: namePreference,
      full_name: fullName,
      furigana: furigana,
      postal_code: postalCode,
      address: address,
      phone: phone,
      message: message,
      tier: selectedTier,
    })

    alert("年額サポートを送信しました！")
    router.push(`/agencies/${params.id}`)

    setLoading(false)
  }

  const handleNextStep = () => {
    if (step === 1 && numericAmount >= 3000) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href={`/agencies/${params.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">年額サポート</h1>
      </div>

      {artist && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {artist.image_url ? (
                <Image
                  src={artist.image_url || "/placeholder.svg"}
                  alt={artist.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary/40" />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">サポート先</p>
                <p className="font-bold">{artist.name}</p>
                {artist.genre && <p className="text-xs text-muted-foreground">{artist.genre}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <>
            <Card className="border-none shadow-lg">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">ご支援金額（円）</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="3000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="3000"
                    step="1000"
                    required
                  />
                  {numericAmount > 0 && numericAmount < 3000 && (
                    <p className="text-sm text-red-500">最低金額は3,000円です</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {artistSupportTiers.map((tier) => {
                const tierLetter = tier.label.charAt(0)
                const isSelected = selectedTier === tierLetter
                const isBelow =
                  selectedTier && tierLetter.charCodeAt(0) < selectedTier.charCodeAt(0) && numericAmount >= tier.amount

                return (
                  <Card
                    key={tier.value}
                    className={`border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : isBelow
                          ? "border-primary/30 bg-primary/5"
                          : "border-border"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{tier.label}</span>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-primary text-sm">
                            <Check className="h-4 w-4" />
                            <span className="text-xs">選択中</span>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check
                            className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>{benefit}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full h-12 text-base rounded-full"
              disabled={!numericAmount || numericAmount < 3000}
            >
              次へ
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">ご芳名記載を希望されますか？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RadioGroup
                  value={namePreference}
                  onValueChange={(v) => setNamePreference(v as "full" | "initial" | "none")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="cursor-pointer font-normal">
                      希望する（氏名）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="initial" id="initial" />
                    <Label htmlFor="initial" className="cursor-pointer font-normal">
                      希望する（イニシャル）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none" className="cursor-pointer font-normal">
                      希望しない
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="flex-1 h-12 text-base rounded-full bg-transparent"
              >
                戻る
              </Button>
              <Button type="button" onClick={handleNextStep} className="flex-1 h-12 text-base rounded-full">
                次へ
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Card className="border-none shadow-lg">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">お名前 *</Label>
                  <Input
                    id="fullName"
                    placeholder="山田 太郎"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furigana">ふりがな *</Label>
                  <Input
                    id="furigana"
                    placeholder="やまだ たろう"
                    value={furigana}
                    onChange={(e) => setFurigana(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">郵便番号 *</Label>
                  <Input
                    id="postalCode"
                    placeholder="123-4567"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">ご住所 *</Label>
                  <Input
                    id="address"
                    placeholder="東京都渋谷区..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">お電話番号 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="03-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">アーティストへのメッセージ（任意）</Label>
                  <Textarea
                    id="message"
                    placeholder="応援メッセージをお書きください"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="flex-1 h-12 text-base rounded-full bg-transparent"
              >
                戻る
              </Button>
              <Button type="submit" className="flex-1 h-12 text-base rounded-full" disabled={loading}>
                {loading ? "送信中..." : `¥${numericAmount.toLocaleString()} でサポートする`}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
