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
