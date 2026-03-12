import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../../../modules/seller"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productId = req.params.id
  const { seller_id: sellerId } = req.body as { seller_id: string }
  if (!productId || !sellerId) {
    return res.status(400).json({
      message: "product id (in URL) and seller_id (in body) are required",
    })
  }

  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  await link.create({
    [Modules.PRODUCT]: { product_id: productId },
    [SELLER_MODULE]: { seller_id: sellerId },
  })
  res.json({ product_id: productId, seller_id: sellerId })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productId = req.params.id
  const { seller_id: sellerId } = req.body as { seller_id?: string }
  if (!productId || !sellerId) {
    return res.status(400).json({
      message: "product id (in URL) and seller_id (in body) are required",
    })
  }

  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  await link.dismiss({
    [Modules.PRODUCT]: { product_id: productId },
    [SELLER_MODULE]: { seller_id: sellerId },
  })
  res.json({ product_id: productId, seller_id: sellerId, unlinked: true })
}
