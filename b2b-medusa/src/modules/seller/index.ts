import SellerModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const SELLER_MODULE = "sellerModule"

export default Module(SELLER_MODULE, {
  service: SellerModuleService,
})
