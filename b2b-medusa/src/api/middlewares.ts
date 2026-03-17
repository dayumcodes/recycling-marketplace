import { defineMiddlewares, authenticate } from "@medusajs/medusa"
import { registerLoggedInUser } from "./middlewares/logged-in-user"
import { adminSellerContext } from "./middlewares/admin-seller-context"
import { restrictSellerAdminAccess } from "./middlewares/restrict-seller-admin-access"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/sellers/me*",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/platform-admin/*",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/admin/*",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"]),
        registerLoggedInUser,
        adminSellerContext,
        restrictSellerAdminAccess,
      ],
    },
  ],
})
