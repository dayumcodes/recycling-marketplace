import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { getMySellerProfile } from "@lib/data/seller-dashboard"
import { listCategories } from "@lib/data/categories"
import CreateProductForm from "@modules/seller/components/create-product-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Add Product | Seller Dashboard",
}

export default async function NewProductPage() {
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

  if (!seller.is_verified) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Verification required
        </h2>
        <p className="text-slate-700 text-sm max-w-md mx-auto">
          You can use the seller dashboard, but adding products is only
          available after a platform admin verifies your account in Manage
          Sellers.
        </p>
        <LocalizedClientLink
          href="/seller"
          className="inline-block mt-2 text-emerald-700 font-medium text-sm hover:underline"
        >
          ← Back to dashboard
        </LocalizedClientLink>
      </div>
    )
  }

  const categories = await listCategories({ limit: 100 }).catch(() => [])

  return <CreateProductForm categories={categories} />
}
