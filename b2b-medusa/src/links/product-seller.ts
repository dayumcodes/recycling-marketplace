import SellerModule from "../modules/seller"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: false,
  },
  {
    linkable: SellerModule.linkable.seller,
    isList: true,
  }
)
