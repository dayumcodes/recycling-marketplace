import { retrieveCustomer } from "@lib/data/customer"
import { getMySellerProfile } from "@lib/data/seller-dashboard"
import { Toaster } from "@medusajs/ui"
import SellerDashboardLayout from "@modules/seller/templates/seller-layout"

export default async function SellerPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)
  const sellerProfile = customer
    ? await getMySellerProfile()
    : null

  return (
    <SellerDashboardLayout customer={customer} seller={sellerProfile}>
      {children}
      <Toaster />
    </SellerDashboardLayout>
  )
}
