"use client"

import Link from "next/link"
import type { StoreSeller } from "@lib/data/sellers"
import { SCRAP_CATEGORIES } from "@lib/marketing-data"
import MarketplaceSearch from "./marketplace-search"

function buildMarketplaceQuery(
  category?: string | null,
  seller?: string | null,
  searchQuery?: string | null
) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (seller) params.set("seller", seller)
  const s = searchQuery?.trim()
  if (s) params.set("q", s)
  const q = params.toString()
  return q ? `?${q}` : ""
}

export default function CategoryFilter({
  countryCode,
  currentCategory,
  currentSeller,
  currentQuery,
  sellers = [],
}: {
  countryCode: string
  currentCategory?: string | null
  currentSeller?: string | null
  currentQuery?: string | null
  sellers?: StoreSeller[]
}) {
  const base = `/${countryCode}/marketplace`
  return (
    <div className="mb-6 space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Browse by material</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${base}${buildMarketplaceQuery(null, currentSeller, currentQuery)}`}
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
              href={`${base}${buildMarketplaceQuery(slug, currentSeller, currentQuery)}`}
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
      <div className="flex flex-col gap-3 large:flex-row large:items-end large:justify-between large:gap-6">
        {sellers.length > 0 ? (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700 mb-2">Sold by</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`${base}${buildMarketplaceQuery(currentCategory, null, currentQuery)}`}
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
                  href={`${base}${buildMarketplaceQuery(
                    currentCategory,
                    s.handle,
                    currentQuery
                  )}`}
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
        ) : (
          <div className="min-w-0 flex-1" aria-hidden />
        )}
        <MarketplaceSearch
          countryCode={countryCode}
          initialQuery={currentQuery}
          currentCategory={currentCategory}
          currentSeller={currentSeller}
        />
      </div>
    </div>
  )
}
