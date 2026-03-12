import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { SELLER_MODULE } from "../../../../modules/seller"

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
    return res.json({ seller: null })
  }
  res.json({ seller: sellers[0] })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)

  const existing = await sellerModuleService.listSellers({
    user_id: customerId,
  })
  if (existing.length > 0) {
    return res.json({ seller: existing[0] })
  }

  const { name, handle, description } = req.body as {
    name: string
    handle: string
    description?: string
  }
  if (!name || !handle) {
    return res.status(400).json({ message: "name and handle are required" })
  }

  const handleExists = await sellerModuleService.listSellers({ handle })
  if (handleExists.length > 0) {
    return res.status(400).json({ message: "Handle already taken" })
  }

  const [seller] = await sellerModuleService.createSellers([
    {
      name,
      handle,
      user_id: customerId,
      description: description ?? null,
    },
  ])
  res.status(201).json({ seller })
}
