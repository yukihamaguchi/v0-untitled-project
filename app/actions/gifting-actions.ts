"use server"

import { getSupabaseServer } from "@/lib/supabase"
import type { GiftingData } from "@/lib/supabase"

// ギフティングデータを保存するアクション
export async function saveGifting(data: GiftingData) {
  try {
    const supabase = getSupabaseServer()

    const { data: insertedData, error } = await supabase.from("giftings").insert([data]).select()

    if (error) {
      console.error("Error saving gifting:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: insertedData[0] }
  } catch (error) {
    console.error("Error in saveGifting:", error)
    return { success: false, error: "ギフティングの保存中にエラーが発生しました" }
  }
}

// ユーザーのギフティング履歴を取得するアクション
export async function getUserGiftings(userId: string) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("giftings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user giftings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUserGiftings:", error)
    return { success: false, error: "ギフティング履歴の取得中にエラーが発生しました" }
  }
}

// アーティストのギフティング履歴を取得するアクション
export async function getArtistGiftings(artistId: string) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("giftings")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching artist giftings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getArtistGiftings:", error)
    return { success: false, error: "ギフティング履歴の取得中にエラーが発生しました" }
  }
}

// イベントごとのギフティング履歴を取得するアクション
export async function getEventGiftings(eventId: number) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("giftings")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching event giftings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getEventGiftings:", error)
    return { success: false, error: "イベントのギフティング履歴の取得中にエラーが発生しました" }
  }
}
