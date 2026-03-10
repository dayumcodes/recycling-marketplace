import type { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export const metadata: Metadata = {
  title: "Marketplace | ScrapCircle",
  description:
    "Explore scrap materials by type, grade, and location on the ScrapCircle B2B marketplace.",
}

export default async function MarketplacePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <div className="pt-8">
      <div className="content-container mb-4">
        <h1 className="text-3xl-semi text-slate-900">
          Scrap recycling marketplace
        </h1>
        <p className="mt-2 text-base-regular text-slate-700 max-w-2xl">
          Browse available materials from verified recyclers. Filter by scrap
          category, grade, and other attributes as you grow the catalog.
        </p>
      </div>
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </div>
  )
}

