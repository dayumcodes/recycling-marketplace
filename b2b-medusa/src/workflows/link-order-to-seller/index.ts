import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { linkOrderToSellerStep } from "./steps/link-order-to-seller"

export type LinkOrderToSellerInput = {
  orderId: string
  sellerId: string
}

export const linkOrderToSellerWorkflow = createWorkflow(
  "link-order-to-seller",
  (input: LinkOrderToSellerInput) => {
    linkOrderToSellerStep(input)
    return new WorkflowResponse(undefined)
  }
)
