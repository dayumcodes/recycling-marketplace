"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

export default function MarketplaceSearch({
  countryCode,
  initialQuery,
  currentCategory,
  currentSeller,
}: {
  countryCode: string
  initialQuery?: string | null
  currentCategory?: string | null
  currentSeller?: string | null
}) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery?.trim() ?? "")

  useEffect(() => {
    setValue(initialQuery?.trim() ?? "")
  }, [initialQuery])

  const base = `/${countryCode}/marketplace`

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (currentCategory) params.set("category", currentCategory)
    if (currentSeller) params.set("seller", currentSeller)
    const q = value.trim()
    if (q) params.set("q", q)

    const next = params.toString()
    router.push(next ? `${base}?${next}` : base)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full small:max-w-xs shrink-0 flex gap-2 small:justify-end"
      role="search"
      aria-label="Search marketplace products"
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search items…"
        className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        autoComplete="off"
      />
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
      >
        Search
      </button>
    </form>
  )
}
