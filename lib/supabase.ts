import { createClient } from "@supabase/supabase-js"

// 環境変数からSupabaseの設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// クライアント側のシングルトンインスタンス
let clientInstance: ReturnType<typeof createClient> | null = null

// クライアント側のSupabaseクライアントを取得
export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// サーバー側のSupabaseクライアントを取得（Server Actionsで使用）
export const getSupabaseServer = () => {
  return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")
}

// ギフティングデータの型定義
export interface GiftingData {
  id?: number
  user_id: string
  user_name: string
  artist_id: string
  artist_name: string
  event_id: number
  event_name: string
  amount: number
  comment?: string
  created_at?: string
}
