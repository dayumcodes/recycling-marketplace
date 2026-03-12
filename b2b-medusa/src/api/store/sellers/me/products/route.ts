import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
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

  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "status",
      "thumbnail",
      "created_at",
      "description",
      "metadata",
      "variants.*",
    ],
  })

  const products = (allProducts ?? []).filter(
    (p: any) => p.metadata?.seller_id === seller.id
  )

  res.json({ products, seller_id: seller.id })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
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

  const {
    title,
    description,
    handle,
    category_ids,
    status,
    variants,
    sales_channel_ids,
    thumbnail,
    images,
  } = req.body as {
    title: string
    description?: string
    handle?: string
    category_ids?: string[]
    status?: string
    variants?: any[]
    sales_channel_ids?: string[]
    thumbnail?: string
    images?: string[]
  }

  if (!title) {
    return res.status(400).json({ message: "title is required" })
  }

  const salesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL)
  let channelIds = sales_channel_ids
  if (!channelIds?.length) {
    const channels = await salesChannelModuleService.listSalesChannels({})
    if (channels.length) {
      channelIds = [channels[0].id]
    }
  }

  const safeHandle =
    handle ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

  const productData: any = {
    title,
    description: description ?? "",
    handle: safeHandle,
    status: status ?? "published",
    metadata: {
      seller_id: seller.id,
      seller_name: seller.name,
      seller_handle: seller.handle,
    },
    options: [{ title: "Default", values: ["Default"] }],
    variants: variants?.length
      ? variants
      : [
          {
            title: "Default",
            options: { Default: "Default" },
            prices: [{ amount: 0, currency_code: "aed" }],
          },
        ],
  }

  if (thumbnail) {
    productData.thumbnail = thumbnail
  }
  if (images?.length) {
    productData.images = images.map((url: string) => ({ url }))
  }

  if (category_ids?.length) {
    productData.category_ids = category_ids
  }
  if (channelIds?.length) {
    productData.sales_channels = channelIds.map((id: string) => ({ id }))
  }

  const { result } = await createProductsWorkflow(req.scope).run({
    input: { products: [productData] },
  })

  const product = result[0]

  try {
    const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
    await link.create({
      [Modules.PRODUCT]: { product_id: product.id },
      [SELLER_MODULE]: { seller_id: seller.id },
    })
  } catch {
    // Link creation may fail if link migration hasn't run; product is still created
  }

  res.status(201).json({ product })
}
