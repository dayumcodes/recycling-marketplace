import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { getMySellerProfile } from "@lib/data/seller-dashboard"
import SellerOverview from "@modules/seller/components/seller-overview"
import SellerRegisterForm from "@modules/seller/components/seller-register-form"

export const metadata: Metadata = {
  title: "Seller Dashboard | ScrapCircle",
  description: "Manage your seller profile and products on ScrapCircle.",
}

export default async function SellerPage() {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) return null

  const seller = await getMySellerProfile()

  if (!seller) {
    return <SellerRegisterForm />
  }

  return <SellerOverview seller={seller} />
}
