"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export type SellerProfile = {
  id: string
  name: string
  handle: string
  user_id: string | null
  description: string | null
  is_verified: boolean
}

export type SellerProduct = {
  id: string
  title: string
  handle: string
  status: string
  description?: string
  thumbnail?: string
  created_at?: string
  variants?: any[]
}

export async function getMySellerProfile(): Promise<SellerProfile | null> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const tagOpts = (await getCacheOptions("seller-profile")) as {
      tags?: string[]
    }
    const sec = parseInt(
      process.env.MEDUSA_SELLER_PROFILE_REVALIDATE_SECONDS || "30",
      10
    )
    const revalidate = Number.isFinite(sec) && sec >= 0 ? sec : 30
    const { seller } = await sdk.client.fetch<{
      seller: SellerProfile | null
    }>("/store/sellers/me", {
      method: "GET",
      headers,
      next: { ...tagOpts, revalidate },
      cache: "force-cache",
    })
    return seller
  } catch {
    return null
  }
}

export async function registerAsSeller(data: {
  name: string
  handle: string
  description?: string
}): Promise<{ seller?: SellerProfile; error?: string }> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const { seller } = await sdk.client.fetch<{
      seller: SellerProfile
    }>("/store/sellers/me", {
      method: "POST",
      headers,
      body: data,
    })
    return { seller }
  } catch (err: any) {
    const msg =
      err?.message || err?.toString() || "Failed to register as seller"
    return { error: msg }
  }
}

export async function getMyProducts(): Promise<SellerProduct[]> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const next = { ...(await getCacheOptions("seller-products")) }
    const { products } = await sdk.client.fetch<{
      products: SellerProduct[]
    }>("/store/sellers/me/products", {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    return products ?? []
  } catch {
    return []
  }
}

export async function createSellerProduct(data: {
  title: string
  description?: string
  handle?: string
  category_ids?: string[]
  status?: string
  thumbnail?: string
  images?: string[]
  variants?: {
    title: string
    prices: { amount: number; currency_code: string }[]
    sku?: string
  }[]
}): Promise<{ product?: any; error?: string }> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const { product } = await sdk.client.fetch<{ product: any }>(
      "/store/sellers/me/products",
      {
        method: "POST",
        headers,
        body: data,
      }
    )
    return { product }
  } catch (err: any) {
    const msg =
      err?.body?.message ??
      err?.message ??
      (typeof err === "string" ? err : null) ??
      err?.toString?.() ??
      "Failed to create product"
    return { error: String(msg) }
  }
}
