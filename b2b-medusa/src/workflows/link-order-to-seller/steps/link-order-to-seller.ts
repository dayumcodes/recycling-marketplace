import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../modules/seller"

type LinkOrderToSellerStepInput = {
  orderId: string
  sellerId: string
}

export const linkOrderToSellerStep = createStep(
  "link-order-to-seller",
  async (input: LinkOrderToSellerStepInput | undefined, { container }) => {
    if (!input?.orderId || !input?.sellerId) {
      return new StepResponse(undefined)
    }
    const { orderId, sellerId } = input
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    await link.create({
      [Modules.ORDER]: { order_id: orderId },
      [SELLER_MODULE]: { seller_id: sellerId },
    })
    return new StepResponse(undefined, { orderId, sellerId })
  },
  async (compensationData, { container }) => {
    if (!compensationData?.orderId || !compensationData?.sellerId) return
    const { orderId, sellerId } = compensationData
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    await link.dismiss({
      [Modules.ORDER]: { order_id: orderId },
      [SELLER_MODULE]: { seller_id: sellerId },
    })
  }
)
