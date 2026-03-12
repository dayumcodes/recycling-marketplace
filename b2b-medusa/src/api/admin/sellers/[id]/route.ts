import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { SELLER_MODULE } from "../../../../modules/seller"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const seller = await sellerModuleService.retrieveSellers(req.params.id)
  res.json({ seller })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const { name, handle, description, is_verified } = req.body as {
    name?: string
    handle?: string
    description?: string
    is_verified?: boolean
  }

  const updateData: Record<string, any> = { id: req.params.id }
  if (name !== undefined) updateData.name = name
  if (handle !== undefined) updateData.handle = handle
  if (description !== undefined) updateData.description = description
  if (is_verified !== undefined) updateData.is_verified = is_verified

  const seller = await sellerModuleService.updateSellers(updateData)

  res.json({ seller })
}
