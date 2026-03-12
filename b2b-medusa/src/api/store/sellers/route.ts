import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../modules/seller"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const sellers = await sellerModuleService.listSellers({})
  res.json({ sellers })
}
