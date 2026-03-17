import SellerModule from "../modules/seller"
import OrderModule from "@medusajs/medusa/order"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: OrderModule.linkable.order,
    isList: false,
  },
  {
    linkable: SellerModule.linkable.seller,
    isList: false,
  }
)
