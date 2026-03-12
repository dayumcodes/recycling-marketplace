import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../../modules/seller"

const ADMIN_EMAILS = (process.env.ADMIN_CUSTOMER_EMAILS || "admin@medusa-test.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())

async function assertPlatformAdmin(req: MedusaRequest, res: MedusaResponse) {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "Not authenticated" })
    return null
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: { id: customerId },
  })
  const customer = customers?.[0]
  if (!customer?.email || !ADMIN_EMAILS.includes(customer.email.toLowerCase())) {
    res.status(403).json({ message: "Not a platform admin" })
    return null
  }

  return customerId
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const adminId = await assertPlatformAdmin(req, res)
  if (!adminId) return

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const sellers = await sellerModuleService.listSellers({})
  res.json({ sellers })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const adminId = await assertPlatformAdmin(req, res)
  if (!adminId) return

  const { seller_id, is_verified } = req.body as {
    seller_id?: string
    is_verified?: boolean
  }

  if (!seller_id) {
    return res.status(400).json({ message: "seller_id is required" })
  }
  if (is_verified === undefined) {
    return res.status(400).json({ message: "is_verified is required" })
  }

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)

  try {
    const seller = await sellerModuleService.updateSellers({
      id: seller_id,
      is_verified,
    })
    res.json({ seller })
  } catch (err: any) {
    res.status(404).json({ message: `Seller with id "${seller_id}" not found` })
  }
}
