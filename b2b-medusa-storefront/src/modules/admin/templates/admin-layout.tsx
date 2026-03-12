import React from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface AdminLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const NAV_ITEMS = [
  { label: "Sellers", href: "/admin/sellers" },
]

const AdminLayoutComponent: React.FC<AdminLayoutProps> = ({
  customer,
  children,
}) => {
  if (!customer) {
    return (
      <div className="flex-1 content-container max-w-4xl mx-auto py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Platform Admin
          </h1>
          <p className="text-slate-600 mb-6">
            You need to log in to access the admin panel.
          </p>
          <LocalizedClientLink
            href="/account"
            className="inline-block bg-[#0B3D2E] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Log in / Sign up
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 content-container max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 small:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0B3D2E]">
              Platform Admin
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {customer.email}
            </p>
          </div>
          {NAV_ITEMS.map((item) => (
            <LocalizedClientLink
              key={item.href}
              href={item.href}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#0B3D2E] transition-colors"
            >
              {item.label}
            </LocalizedClientLink>
          ))}
          <hr className="my-4 border-slate-200" />
          <LocalizedClientLink
            href="/marketplace"
            className="block px-4 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            &larr; Back to Marketplace
          </LocalizedClientLink>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayoutComponent
