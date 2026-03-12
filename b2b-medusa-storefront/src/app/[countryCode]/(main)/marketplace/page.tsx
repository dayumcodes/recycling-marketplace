import type { Metadata } from "next"

import { getCategoryByHandle } from "@lib/data/categories"
import { getProductIdsBySellerHandle, getSellers } from "@lib/data/sellers"
import CategoryFilter from "@modules/marketplace/components/category-filter"
import StoreTemplate from "@modules/store/templates"
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    seller?: string
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
  const { sortBy, page, category: categoryHandle, seller: sellerHandle } = searchParams

  const [category, sellers] = await Promise.all([
    categoryHandle ? getCategoryByHandle([categoryHandle]) : Promise.resolve(null),
    getSellers(),
  ])

  const productsIds = sellerHandle
    ? await getProductIdsBySellerHandle(sellerHandle)
    : undefined

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
        <div className="content-container mt-4">
          <CategoryFilter
            countryCode={params.countryCode}
            currentCategory={categoryHandle}
            currentSeller={sellerHandle}
            sellers={sellers}
          />
        </div>
      </div>
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        categoryId={category?.id}
        categoryName={category?.name}
        productsIds={productsIds?.length ? productsIds : undefined}
      />
    </div>
  )
}

