import "server-only"

import { getCacheOptions } from "@lib/data/cookies"

/**
 * Controls Next.js `fetch` caching for Medusa `/store/products` calls used by
 * the marketplace and product listings.
 *
 * Env:
 * - `MEDUSA_STORE_PRODUCTS_CACHE` (default: `revalidate`)
 *   - `revalidate` — time-based revalidation (see below). Avoids long-lived stale
 *     empty responses from `force-cache` after misconfiguration/deploys.
 *   - `no-store` — never cache product list fetches (max freshness, more load on Medusa).
 *   - `force-cache` — previous behavior: `force-cache` + cache tags when cookie present.
 * - `MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS` — used when mode is `revalidate` (default: 60).
 *   Use `0` to revalidate on every request (still not identical to `no-store` but close).
 */
export type MedusaStoreProductsCacheMode =
  | "revalidate"
  | "no-store"
  | "force-cache"

export async function getMedusaStoreProductsFetchInit(): Promise<{
  next: { revalidate?: number; tags?: string[] }
  cache: RequestCache
}> {
  const raw = (
    process.env.MEDUSA_STORE_PRODUCTS_CACHE || "revalidate"
  ).toLowerCase()

  const mode: MedusaStoreProductsCacheMode =
    raw === "no-store" || raw === "force-cache" ? raw : "revalidate"

  const tagOpts = (await getCacheOptions("products")) as {
    tags?: string[]
  }

  if (mode === "no-store") {
    return { cache: "no-store", next: {} }
  }

  if (mode === "force-cache") {
    return { cache: "force-cache", next: { ...tagOpts } }
  }

  const sec = parseInt(
    process.env.MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS || "60",
    10
  )
  const revalidate = Number.isFinite(sec) && sec >= 0 ? sec : 60

  return {
    cache: "force-cache",
    next: { ...tagOpts, revalidate },
  }
}
