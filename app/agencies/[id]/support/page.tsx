"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Heart, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { getAgencyById, supportTiers } from "@/lib/agencies-data"
import { useRouter } from "next/navigation"

interface AgencySupportPageProps {
  params: {
    id: string
  }
}

export default function AgencySupportPage({ params }: AgencySupportPageProps) {
  const router = useRouter()
  const agency = getAgencyById(params.id)

  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [nameDisplayOption, setNameDisplayOption] = useState("")
  const [fullName, setFullName] = useState("")
  const [furigana, setFurigana] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const getActiveTierIndex = (amountValue: number) => {
    if (amountValue >= 100000) return 3 // Tier D
    if (amountValue >= 50000) return 2 // Tier C
    if (amountValue >= 30000) return 1 // Tier B
    if (amountValue >= 5000) return 0 // Tier A
    return -1 // No tier
  }

  const amountValue = Number.parseInt(amount) || 0
  const activeTierIndex = getActiveTierIndex(amountValue)

  const handleStep1Next = () => {
    if (amountValue < 5000) {
      alert("ご支援金は5,000円以上からとなります。")
      return
    }
    setStep(2)
  }

  const handleStep2Next = () => {
    if (!nameDisplayOption) {
      alert("ご芳名記載の希望を選択してください。")
      return
    }
    setStep(3)
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const selectedTier = activeTierIndex >= 0 ? supportTiers[activeTierIndex] : null

    console.log("[v0] Support submitted:", {
      support_type: "agency",
      agency_id: params.id,
      amount: amountValue,
      tier: selectedTier?.label,
      nameDisplayOption,
      fullName,
      furigana,
      postalCode,
      address,
      phone,
      message,
    })

    alert("年額サポートを送信しました！")
    router.push("/")

    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href={step === 1 ? `/agencies/${params.id}` : "#"}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={(e) => {
              if (step > 1) {
                e.preventDefault()
                setStep(step - 1)
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">年額サポート {step > 1 && `(${step}/3)`}</h1>
      </div>

      {agency && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">サポート先</p>
                <p className="font-bold">{agency.name}</p>
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

      {step === 1 && (
        <div className="space-y-5">
          <Card className="border-none shadow-lg">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">ご支援金</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="5000"
                    min="5000"
                    step="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">※5,000円以上からご支援いただけます</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold px-1">サポートプラン</h2>
            {supportTiers.map((tier, index) => {
              const isActive = index === activeTierIndex
              const isPassed = activeTierIndex > index && activeTierIndex >= 0

              return (
                <Card
                  key={tier.label}
                  className={`border-2 transition-all ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-lg"
                      : isPassed
                        ? "border-primary/30 bg-primary/5"
                        : "border-border"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">{tier.label}</p>
                          {isActive && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">¥{tier.amount.toLocaleString()}以上</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {tier.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 text-xs ${
                            isActive || isPassed ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 mt-0.5 flex-shrink-0 ${
                              isActive || isPassed ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button
            type="button"
            onClick={handleStep1Next}
            className="w-full h-12 text-base rounded-full"
            disabled={amountValue < 5000}
          >
            {amountValue >= 5000 ? "次へ" : "金額を入力してください"}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Card className="border-none shadow-lg">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <Label className="text-base">ご芳名記載を希望されますか？</Label>
                <RadioGroup value={nameDisplayOption} onValueChange={setNameDisplayOption}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="fullname" id="fullname" />
                    <Label htmlFor="fullname" className="flex-1 cursor-pointer font-normal">
                      希望する（氏名）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="initial" id="initial" />
                    <Label htmlFor="initial" className="flex-1 cursor-pointer font-normal">
                      希望する（イニシャル）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none" className="flex-1 cursor-pointer font-normal">
                      希望しない
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Button
            type="button"
            onClick={handleStep2Next}
            className="w-full h-12 text-base rounded-full"
            disabled={!nameDisplayOption}
          >
            次へ
          </Button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-5">
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
                <Label htmlFor="message">アーティストへのメッセージ</Label>
                <Textarea
                  id="message"
                  placeholder="応援のメッセージをお書きください"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
            <p className="font-semibold">サポート内容確認</p>
            <p className="text-muted-foreground">金額: ¥{amountValue.toLocaleString()}</p>
            <p className="text-muted-foreground">
              プラン: {activeTierIndex >= 0 ? supportTiers[activeTierIndex].label : ""}
            </p>
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-full" disabled={loading}>
            {loading ? "送信中..." : `¥${amountValue.toLocaleString()} でサポートする`}
          </Button>
        </form>
      )}
    </div>
  )
}
