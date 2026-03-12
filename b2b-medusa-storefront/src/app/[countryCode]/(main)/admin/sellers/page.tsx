import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { getAllSellersAdmin } from "@lib/data/platform-admin"
import AdminSellersTable from "@modules/admin/components/admin-sellers-table"

export const metadata: Metadata = {
  title: "Manage Sellers | ScrapCircle Admin",
  description: "Verify or reject sellers on the ScrapCircle platform.",
}

export default async function AdminSellersPage() {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) return null

  const { sellers, error } = await getAllSellersAdmin()

  if (error === "forbidden") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Access Denied
        </h1>
        <p className="text-slate-600">
          Your account does not have platform admin privileges.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Contact the platform owner to be added as an admin.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center">
        <h1 className="text-xl font-bold text-red-700 mb-2">Error</h1>
        <p className="text-slate-600">{error}</p>
      </div>
    )
  }

  return <AdminSellersTable sellers={sellers} />
}
