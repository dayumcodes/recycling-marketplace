"use client"

import Link from "next/link"
import type { StoreSeller } from "@lib/data/sellers"
import { SCRAP_CATEGORIES } from "@lib/marketing-data"

function buildMarketplaceQuery(category?: string | null, seller?: string | null) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (seller) params.set("seller", seller)
  const q = params.toString()
  return q ? `?${q}` : ""
}

export default function CategoryFilter({
  countryCode,
  currentCategory,
  currentSeller,
  sellers = [],
}: {
  countryCode: string
  currentCategory?: string | null
  currentSeller?: string | null
  sellers?: StoreSeller[]
}) {
  const base = `/${countryCode}/marketplace`
  return (
    <div className="mb-6 space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Browse by material</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${base}${buildMarketplaceQuery(null, currentSeller)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !currentCategory
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          {SCRAP_CATEGORIES.map(({ name, slug }) => (
            <Link
              key={slug}
              href={`${base}${buildMarketplaceQuery(slug, currentSeller)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                currentCategory === slug
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
      {sellers.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Sold by</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${base}${buildMarketplaceQuery(currentCategory, null)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !currentSeller
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All sellers
            </Link>
            {sellers.map((s) => (
              <Link
                key={s.id}
                href={`${base}${buildMarketplaceQuery(currentCategory, s.handle)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  currentSeller === s.handle
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
