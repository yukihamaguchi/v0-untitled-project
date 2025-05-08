// セッション情報の型定義
export interface UserSession {
  email: string
  role: "user" | "artist"
  name: string
}

// セッション情報をローカルストレージに保存する関数
export function saveUserSession(session: UserSession): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userSession", JSON.stringify(session))
  }
}

// セッション情報をローカルストレージから取得する関数
export function getUserSession(): UserSession | null {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("userSession")
    if (session) {
      return JSON.parse(session)
    }
  }
  return null
}

// セッション情報をローカルストレージから削除する関数
export function clearUserSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userSession")
  }
}

// ユーザーがログインしているかチェックする関数
export function isLoggedIn(): boolean {
  return getUserSession() !== null
}

// ユーザーの役割を取得する関数
export function getUserRole(): string | null {
  const session = getUserSession()
  return session ? session.role : null
}
