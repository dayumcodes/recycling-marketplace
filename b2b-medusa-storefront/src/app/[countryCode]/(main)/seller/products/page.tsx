import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { getMySellerProfile, getMyProducts } from "@lib/data/seller-dashboard"
import SellerProductList from "@modules/seller/components/seller-product-list"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "My Products | Seller Dashboard",
}

export default async function SellerProductsPage() {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) return null

  const seller = await getMySellerProfile()
  if (!seller) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600">
          You need to register as a seller first.
        </p>
        <LocalizedClientLink
          href="/seller"
          className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
        >
          Register as Seller →
        </LocalizedClientLink>
      </div>
    )
  }

  const products = await getMyProducts()

  return <SellerProductList products={products} />
}
