import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../../../modules/seller"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const sellers = await sellerModuleService.listSellers({
    user_id: customerId,
  })
  if (!sellers.length) {
    return res.status(403).json({ message: "Not a seller" })
  }
  const seller = sellers[0]

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "status",
      "created_at",
      "total",
      "currency_code",
      "summary.*",
      "items.*",
      "shipping_address.*",
      "billing_address.*",
    ],
    filters: {
      seller: { id: [seller.id] },
    } as Record<string, unknown>,
  })

  res.json({ orders: orders ?? [], seller_id: seller.id })
}
