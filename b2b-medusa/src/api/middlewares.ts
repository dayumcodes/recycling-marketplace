import { defineMiddlewares, authenticate } from "@medusajs/medusa"

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
  ],
})
