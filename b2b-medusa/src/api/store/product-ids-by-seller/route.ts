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
  const handle = req.query.handle as string
  if (!handle || typeof handle !== "string") {
    return res.json({ product_ids: [] })
  }

  try {
    const sellerModuleService = req.scope.resolve(SELLER_MODULE)
    const sellers = await sellerModuleService.listSellers({ handle })
    if (!sellers.length) {
      return res.json({ product_ids: [] })
    }
    const sellerId = sellers[0].id

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: ["id", "metadata"],
    })

    const productIds = (allProducts ?? [])
      .filter((p: any) => p.metadata?.seller_id === sellerId)
      .map((p: any) => p.id)

    res.json({ product_ids: productIds })
  } catch {
    res.json({ product_ids: [] })
  }
}
