/**
 * 金額ごとのPayPayリンクマップ
 */
const PAYPAY_LINKS: Record<string, string> = {
  "100": "https://qr.paypay.ne.jp/p2p01_RQnxwKluaCcYFxE8",
  "500": "https://qr.paypay.ne.jp/p2p01_59O5MgfhqPQ4JOZf",
  "1000": "https://qr.paypay.ne.jp/p2p01_6c5DPqTA9iLdgUel",
  "3000": "https://qr.paypay.ne.jp/p2p01_dynBq6GSe9xA0LXl",
  "5000": "https://qr.paypay.ne.jp/p2p01_GQ1xHAibpi3dpGhC",
  "10000": "https://qr.paypay.ne.jp/p2p01_1rFaL3fgq6pwZ1Da",
}

/**
 * メッセージから絵文字や改行を削除する関数
 * @param message 元のメッセージ
 * @returns サニタイズされたメッセージ
 */
export function sanitizeMessage(message: string): string {
  // Unicodeのサロゲートペア領域（絵文字など）を削除
  const withoutEmoji = message.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")

  // 改行を空白に置換
  const withoutLineBreaks = withoutEmoji.replace(/\r?\n|\r/g, " ")

  return withoutLineBreaks
}

/**
 * PayPayの支払いリンクを生成する関数
 * @param paypayId PayPay ID (使用しない)
 * @param amount 金額
 * @param message メッセージ (使用しない)
 * @returns PayPay支払いリンク
 */
export function generatePayPayLink(paypayId: string, amount: number | string, message: string): string {
  // 金額に応じたURLを返す
  const amountStr = amount.toString()
  const payPayLink = PAYPAY_LINKS[amountStr] || PAYPAY_LINKS["500"] // デフォルトは500円

  // デバッグ用にコンソールに出力
  console.log("Selected amount:", amountStr)
  console.log("PayPay URL for amount:", payPayLink)

  // メッセージはURLに付与しない
  return payPayLink
}

/**
 * 支払い情報をローカルストレージに保存する
 */
export function savePaymentInfo(paymentInfo: {
  eventId: number
  performerId: number
  performerName: string
  amount: string
  comment: string
}): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo))
  }
}

/**
 * 支払い情報をローカルストレージから取得する
 */
export function getPaymentInfo(): {
  eventId: number
  performerId: number
  performerName: string
  amount: string
  comment: string
} | null {
  if (typeof window !== "undefined") {
    const info = localStorage.getItem("paymentInfo")
    if (info) {
      return JSON.parse(info)
    }
  }
  return null
}

/**
 * 支払い情報をローカルストレージから削除する
 */
export function clearPaymentInfo(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("paymentInfo")
  }
}
