import type { SellerProfile } from "@lib/data/seller-dashboard"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SellerOverview({
  seller,
}: {
  seller: SellerProfile
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Welcome, {seller.name}
        </h1>
        <p className="text-sm text-slate-500 mb-4">@{seller.handle}</p>
        {seller.description && (
          <p className="text-slate-600 mb-4">{seller.description}</p>
        )}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              seller.is_verified
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                seller.is_verified ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {seller.is_verified ? "Verified" : "Pending verification"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LocalizedClientLink
          href="/seller/products"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <h3 className="font-semibold text-slate-900 group-hover:text-[#0B3D2E] mb-1">
            My Products
          </h3>
          <p className="text-sm text-slate-500">
            View and manage your listed products
          </p>
        </LocalizedClientLink>
        {seller.is_verified ? (
          <LocalizedClientLink
            href="/seller/products/new"
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-[#0B3D2E] mb-1">
              Add Product
            </h3>
            <p className="text-sm text-slate-500">
              List a new product on the marketplace
            </p>
          </LocalizedClientLink>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
            <h3 className="font-semibold text-slate-500 mb-1">Add Product</h3>
            <p className="text-sm text-amber-800">
              Listing is enabled after a platform admin verifies your seller
              account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
