import "server-only"

import { getCacheOptions } from "@lib/data/cookies"

/**
 * Next.js fetch caching for `/store/sellers`.
 * Anonymous users had no cache tags, so sellers were frozen under `force-cache`.
 * Time-based revalidation keeps new sellers visible without manual purges.
 */
export async function getMedusaSellersFetchInit(): Promise<{
  next: { revalidate?: number; tags?: string[] }
  cache: RequestCache
}> {
  const tagOpts = (await getCacheOptions("sellers")) as { tags?: string[] }
  const sec = parseInt(
    process.env.MEDUSA_STORE_SELLERS_REVALIDATE_SECONDS || "60",
    10
  )
  const revalidate = Number.isFinite(sec) && sec >= 0 ? sec : 60
  return {
    cache: "force-cache",
    next: { ...tagOpts, revalidate },
  }
}
