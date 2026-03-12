"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export type AdminSeller = {
  id: string
  name: string
  handle: string
  user_id: string | null
  description: string | null
  is_verified: boolean
  created_at?: string
  updated_at?: string
}

export async function getAllSellersAdmin(): Promise<{
  sellers: AdminSeller[]
  error?: string
}> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const next = { ...(await getCacheOptions("admin-sellers")) }
    const { sellers } = await sdk.client.fetch<{
      sellers: AdminSeller[]
    }>("/store/platform-admin/sellers", {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    return { sellers: sellers ?? [] }
  } catch (err: any) {
    const msg = err?.message || err?.toString() || "Failed to fetch sellers"
    if (msg.includes("403") || msg.includes("Not a platform admin")) {
      return { sellers: [], error: "forbidden" }
    }
    return { sellers: [], error: msg }
  }
}

export async function updateSellerVerification(
  sellerId: string,
  isVerified: boolean
): Promise<{ seller?: AdminSeller; error?: string }> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const { seller } = await sdk.client.fetch<{ seller: AdminSeller }>(
      `/store/platform-admin/sellers`,
      {
        method: "POST",
        headers,
        body: { seller_id: sellerId, is_verified: isVerified },
      }
    )
    return { seller }
  } catch (err: any) {
    const msg =
      err?.message || err?.toString() || "Failed to update seller"
    return { error: msg }
  }
}
