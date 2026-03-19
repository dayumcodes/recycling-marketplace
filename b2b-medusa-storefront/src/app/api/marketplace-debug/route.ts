import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import { getMedusaStoreProductsFetchInit } from "@lib/util/medusa-store-products-fetch"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Diagnostic endpoint: compares region resolution + one `/store/products` call
 * (same shape as marketplace default sort) with current cache settings.
 *
 * Security:
 * - In **production**, requires `MARKETPLACE_DEBUG_SECRET` to be set in env and
 *   matching query `?secret=...`.
 * - In non-production, allowed without a secret (local debugging).
 */
export async function GET(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production"
  const expectedSecret = process.env.MARKETPLACE_DEBUG_SECRET

  if (isProd) {
    if (!expectedSecret?.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const provided = request.nextUrl.searchParams.get("secret")
    if (provided !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const countryCode =
    request.nextUrl.searchParams.get("countryCode")?.toLowerCase() || "ae"

  const cacheMode =
    process.env.MEDUSA_STORE_PRODUCTS_CACHE || "revalidate"
  const revalidateSeconds =
    process.env.MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS || "60"

  let medusaHost = "unknown"
  try {
    medusaHost = new URL(
      process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    ).hostname
  } catch {
    /* ignore */
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return NextResponse.json({
      ok: false,
      countryCode,
      regionResolved: false,
      cacheMode,
      revalidateSeconds,
      medusaHost,
      hint: "getRegion returned null; marketplace will show empty products.",
    })
  }

  const { cache, next } = await getMedusaStoreProductsFetchInit()

  try {
    const { products, count } = await sdk.client.fetch<{
      products: { id?: string; handle?: string | null }[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
        limit: 12,
        offset: 0,
        order: "created_at",
      },
      headers: {},
      next,
      cache,
    })

    const list = products ?? []

    return NextResponse.json({
      ok: true,
      countryCode,
      regionResolved: true,
      regionId: region.id,
      cacheMode,
      revalidateSeconds,
      medusaHost,
      fetchCache: cache,
      nextConfig: next,
      count: count ?? 0,
      returned: list.length,
      sampleHandles: list
        .slice(0, 8)
        .map((p) => p.handle)
        .filter(Boolean),
      sampleIds: list
        .slice(0, 8)
        .map((p) => p.id)
        .filter(Boolean),
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      {
        ok: false,
        countryCode,
        regionResolved: true,
        regionId: region.id,
        cacheMode,
        revalidateSeconds,
        medusaHost,
        error: message,
      },
      { status: 502 }
    )
  }
}
