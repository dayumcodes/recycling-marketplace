import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../../../modules/seller"

type RequestWithSeller = MedusaRequest & { sellerContext?: { id: string } }

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

  const sellerContext = (req as RequestWithSeller).sellerContext
  if (sellerContext && sellerId !== sellerContext.id) {
    return res.status(403).json({ message: "Sellers can only link products to their own store" })
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

  const sellerContext = (req as RequestWithSeller).sellerContext
  if (sellerContext && sellerId !== sellerContext.id) {
    return res.status(403).json({ message: "Sellers can only unlink their own products" })
  }

  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  await link.dismiss({
    [Modules.PRODUCT]: { product_id: productId },
    [SELLER_MODULE]: { seller_id: sellerId },
  })
  res.json({ product_id: productId, seller_id: sellerId, unlinked: true })
}
