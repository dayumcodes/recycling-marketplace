import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getSellersByProductIds } from "@lib/data/sellers"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  searchQuery,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  searchQuery?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  const debug = process.env.DEBUG_MARKETPLACE_PRODUCTS === "1"

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (searchQuery) {
    ;(queryParams as { q?: string }).q = searchQuery
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <p className="text-base-regular text-slate-600">
        Catalog is temporarily unavailable. Please try again later.
      </p>
    )
  }

  if (debug) {
    console.log("[marketplace][PaginatedProducts] params", {
      page,
      sortBy,
      countryCode,
      regionId: region.id,
      queryParams,
    })
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  if (debug) {
    console.log("[marketplace][PaginatedProducts] results", {
      count,
      returned: products.length,
      ids: products.map((p) => p.id).filter(Boolean).slice(0, 5),
    })
  }

  const productIds = products.map((p) => p.id!).filter(Boolean)
  const sellersByProductId = await getSellersByProductIds(productIds)

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview
                product={p}
                region={region}
                seller={p.id ? sellersByProductId[p.id] ?? null : null}
              />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
