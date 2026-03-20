"use server"

import { sdk } from "@lib/config"
import { getMedusaSellersFetchInit } from "@lib/util/medusa-sellers-fetch"
import { getCacheOptions } from "./cookies"

export type StoreSeller = {
  id: string
  name: string
  handle: string
}

export async function getSellers(): Promise<StoreSeller[]> {
  try {
    const { next, cache } = await getMedusaSellersFetchInit()
    const { sellers } = await sdk.client.fetch<{ sellers: StoreSeller[] }>(
      "/store/sellers",
      {
        method: "GET",
        next,
        cache,
      }
    )
    return sellers ?? []
  } catch {
    return []
  }
}

export async function getSellersByProductIds(
  productIds: string[]
): Promise<Record<string, StoreSeller | null>> {
  if (productIds.length === 0) return {}
  try {
    const next = {
      ...(await getCacheOptions("sellers")),
    }
    const ids = productIds.join(",")
    const { sellers_by_product_id } = await sdk.client.fetch<{
      sellers_by_product_id: Record<string, StoreSeller | null>
    }>(`/store/seller-by-product-ids?ids=${encodeURIComponent(ids)}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    return sellers_by_product_id ?? {}
  } catch {
    return {}
  }
}

export async function getProductIdsBySellerHandle(
  sellerHandle: string
): Promise<string[]> {
  if (!sellerHandle) return []
  try {
    const next = {
      ...(await getCacheOptions("sellers")),
    }
    const { product_ids } = await sdk.client.fetch<{ product_ids: string[] }>(
      `/store/product-ids-by-seller?handle=${encodeURIComponent(sellerHandle)}`,
      {
        method: "GET",
        next,
        cache: "force-cache",
      }
    )
    return product_ids ?? []
  } catch {
    return []
  }
}
