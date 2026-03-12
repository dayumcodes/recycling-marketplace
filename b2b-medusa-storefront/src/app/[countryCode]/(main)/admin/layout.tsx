import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AdminLayout from "@modules/admin/templates/admin-layout"

export default async function AdminPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <AdminLayout customer={customer}>
      {children}
      <Toaster />
    </AdminLayout>
  )
}
