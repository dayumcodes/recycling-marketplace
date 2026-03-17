import { model } from "@medusajs/framework/utils"

const Seller = model.define("seller", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text(),
  user_id: model.text().nullable(),
  admin_user_id: model.text().nullable(),
  description: model.text().nullable(),
  is_verified: model.boolean().default(false),
})

export default Seller
