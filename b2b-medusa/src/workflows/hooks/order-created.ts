import { createOrderWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { linkOrderToSellerWorkflow } from "../link-order-to-seller"

createOrderWorkflow.hooks.orderCreated(
  async ({ order }, { container }) => {
    if (!order?.id) return

    const items = order.items ?? []
    const firstItem = items[0]
    if (!firstItem?.variant_id) return

    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "metadata"],
      filters: {
        variants: {
          id: [firstItem.variant_id],
        },
      },
    })

    const product = products?.[0] as { metadata?: { seller_id?: string } } | undefined
    const sellerId = product?.metadata?.seller_id
    if (!sellerId) return

    await linkOrderToSellerWorkflow(container).run({
      input: { orderId: order.id, sellerId },
    })
  }
)
