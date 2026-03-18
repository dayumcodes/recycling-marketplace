import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { SELLER_MODULE } from "../../../modules/seller"

type RequestWithSeller = MedusaRequest & { sellerContext?: { id: string } }


export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const sellerContext = (req as RequestWithSeller).sellerContext

  if (sellerContext) {
    const sellers = await sellerModuleService.listSellers({ id: sellerContext.id })
    return res.json({ sellers })
  }

  const sellers = await sellerModuleService.listSellers({})
  res.json({ sellers })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const sellerContext = (req as RequestWithSeller).sellerContext
  if (sellerContext) {
    return res.status(403).json({ message: "Sellers cannot create other sellers from admin" })
  }

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const { name, handle, user_id, description } = req.body as {
    name: string
    handle: string
    user_id?: string
    description?: string
  }
  if (!name || !handle) {
    return res.status(400).json({
      message: "name and handle are required",
    })
  }
  const [seller] = await sellerModuleService.createSellers([
    { name, handle, user_id: user_id ?? null, description: description ?? null },
  ])
  res.status(201).json({ seller })
}
