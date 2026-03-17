import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { SELLER_MODULE } from "../../../../modules/seller"

type RequestWithSeller = MedusaRequest & { sellerContext?: { id: string } }

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const sellerContext = (req as RequestWithSeller).sellerContext
  if (sellerContext && req.params.id !== sellerContext.id) {
    return res.status(403).json({ message: "You can only view your own seller profile" })
  }

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const seller = await sellerModuleService.retrieveSeller(req.params.id)
  res.json({ seller })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const sellerContext = (req as RequestWithSeller).sellerContext
  if (sellerContext && req.params.id !== sellerContext.id) {
    return res.status(403).json({ message: "You can only update your own seller profile" })
  }

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

  if (is_verified !== undefined) {
    if (sellerContext) {
      return res.status(403).json({ message: "Sellers cannot change verification status" })
    }
    updateData.is_verified = is_verified
  }

  const seller = await sellerModuleService.updateSellers(updateData)

  res.json({ seller })
}
