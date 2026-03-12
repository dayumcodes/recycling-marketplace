import type { SellerProduct } from "@lib/data/seller-dashboard"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SellerProductList({
  products,
}: {
  products: SellerProduct[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          My Products ({products.length})
        </h1>
        <LocalizedClientLink
          href="/seller/products/new"
          className="bg-[#0B3D2E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors"
        >
          + Add Product
        </LocalizedClientLink>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">
            You haven&apos;t listed any products yet.
          </p>
          <LocalizedClientLink
            href="/seller/products/new"
            className="inline-block bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            List your first product
          </LocalizedClientLink>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 font-medium text-slate-500">
                  Product
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Handle
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          N/A
                        </div>
                      )}
                      <span className="font-medium text-slate-900">
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{p.handle}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.status === "draft"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
