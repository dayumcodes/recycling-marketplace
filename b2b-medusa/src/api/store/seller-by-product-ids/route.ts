import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ids = req.query.ids as string
  if (!ids || typeof ids !== "string") {
    return res.json({ sellers_by_product_id: {} })
  }
  const productIds = ids.split(",").map((id) => id.trim()).filter(Boolean)
  if (productIds.length === 0) {
    return res.json({ sellers_by_product_id: {} })
  }

  const sellersByProductId: Record<
    string,
    { id: string; name: string; handle: string } | null
  > = {}
  for (const id of productIds) {
    sellersByProductId[id] = null
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "metadata"],
      filters: { id: productIds },
    })

    for (const p of products || []) {
      const meta = (p as any).metadata
      if (p.id && meta?.seller_id) {
        sellersByProductId[p.id] = {
          id: meta.seller_id,
          name: meta.seller_name ?? "",
          handle: meta.seller_handle ?? "",
        }
      }
    }
  } catch {
    // Gracefully return empty seller map
  }

  res.json({ sellers_by_product_id: sellersByProductId })
}
