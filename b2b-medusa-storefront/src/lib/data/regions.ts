"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    const normalized = countryCode?.toLowerCase() || ""
    if (normalized && regionMap.has(normalized)) {
      return regionMap.get(normalized)
    }

    const regions = await listRegions()

    if (!regions?.length) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        const code = (c?.iso_2 ?? "").toLowerCase()
        if (code) {
          regionMap.set(code, region)
        }
      })
    })

    const byCountry = normalized
      ? regionMap.get(normalized)
      : regionMap.get("us")

    // Fallback when URL country is not on any region (stale DB, new country in URL, etc.)
    return byCountry ?? regions[0] ?? null
  } catch (e: any) {
    return null
  }
}
