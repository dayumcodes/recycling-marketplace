"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const debug = process.env.DEBUG_MARKETPLACE_PRODUCTS === "1"

  const next = {
    ...(await getCacheOptions("products")),
  }

  if (debug) {
    const hasAuth = "authorization" in headers
    // Server action: logs go to the Next.js terminal output
    console.log("[marketplace][listProducts] request", {
      pageParam,
      limit,
      offset,
      countryCode,
      regionId,
      resolvedRegionId: region?.id,
      hasAuth,
      queryParams,
    })
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      if (debug) {
        console.log("[marketplace][listProducts] response", {
          count,
          returned: products?.length ?? 0,
          nextPage,
          offset,
          limit,
          firstId: products?.[0]?.id,
          lastId: products?.[products?.length - 1]?.id,
        })
      }

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const debug = process.env.DEBUG_MARKETPLACE_PRODUCTS === "1"

  // We sort client-side for some sort modes; therefore we must fetch enough
  // products to satisfy the requested page, not just the first 100.
  const region = await getRegion(countryCode)
  if (!region) {
    return { response: { products: [], count: 0 }, nextPage: null, queryParams }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const pageParam = Math.max(page, 1)
  const needed = pageParam * limit
  const batchLimit = 100
  let offset = 0
  let totalCount = 0
  const all: HttpTypes.StoreProduct[] = []

  if (debug) {
    const hasAuth = "authorization" in headers
    console.log("[marketplace][listProductsWithSort] start", {
      sortBy,
      page: pageParam,
      limit,
      needed,
      batchLimit,
      countryCode,
      regionId: region.id,
      hasAuth,
      queryParams,
    })
  }

  // Fetch in batches until we have enough for the requested page (or exhaust).
  // Safety cap prevents runaway loops if backend misreports count.
  const maxBatches = 50
  for (let i = 0; i < maxBatches; i++) {
    const { products, count } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit: batchLimit,
        offset,
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
        ...queryParams,
      },
      headers,
      next,
      cache: "force-cache",
    })

    totalCount = count ?? 0
    all.push(...(products ?? []))

    if (debug) {
      console.log("[marketplace][listProductsWithSort] batch", {
        batch: i + 1,
        offset,
        batchReturned: products?.length ?? 0,
        accumulated: all.length,
        totalCount,
      })
    }

    offset += batchLimit

    const exhausted = products?.length ? products.length < batchLimit : true
    if (all.length >= needed || offset >= totalCount || exhausted) {
      break
    }
  }

  const sortedProducts = sortProducts(all, sortBy)

  const sliceFrom = (pageParam - 1) * limit

  const nextPage =
    totalCount > sliceFrom + limit ? sliceFrom + limit : null

  const paginatedProducts = sortedProducts.slice(sliceFrom, sliceFrom + limit)

  if (debug) {
    console.log("[marketplace][listProductsWithSort] done", {
      totalCount,
      accumulated: all.length,
      returned: paginatedProducts.length,
      page: pageParam,
      limit,
      nextPage,
      sliceFrom,
    })
  }

  return {
    response: {
      products: paginatedProducts,
      count: totalCount,
    },
    nextPage,
    queryParams,
  }
}
