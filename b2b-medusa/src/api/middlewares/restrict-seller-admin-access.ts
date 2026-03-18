import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type RequestWithSeller = MedusaRequest & { sellerContext?: { id: string } }

/**
 * Allowlist approach: when the user is a seller (sellerContext set), only permit
 * access to routes the seller actually needs. Everything else returns 403.
 *
 * This ensures sellers cannot access platform-wide admin features like
 * customers, promotions, price lists, inventory management, settings, invites, etc.
 */
const SELLER_ALLOWED_PREFIXES = [
  "/admin/users/me",
  "/admin/store",
  "/admin/stores",
  "/admin/products",
  "/admin/product-variants",
  "/admin/product-tags",
  "/admin/product-categories",
  "/admin/product-types",
  "/admin/price-preferences",
  "/admin/price-lists",
  "/admin/promotions",
  "/admin/inventory-items",
  "/admin/reservations",
  "/admin/orders",
  "/admin/return-reasons",
  "/admin/sellers",
  "/admin/collections",
  "/admin/categories",
  "/admin/sales-channels",
  "/admin/customers",
  "/admin/customer-groups",
  "/admin/regions",
  "/admin/currencies",
  "/admin/tax-rates",
  "/admin/tax-regions",
  "/admin/shipping-options",
  "/admin/shipping-profiles",
  "/admin/fulfillment-sets",
  "/admin/fulfillment-providers",
  "/admin/stock-locations",
  "/admin/uploads",
  "/admin/notifications",
  "/admin/api-keys",
  "/admin/custom",
]

function isAllowedForSeller(path: string): boolean {
  if (!path || !path.startsWith("/admin")) return false
  return SELLER_ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + "/") || path.startsWith(prefix + "?"))
}

export async function restrictSellerAdminAccess(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void | Promise<void>
): Promise<void> {
  const sellerContext = (req as RequestWithSeller).sellerContext
  if (!sellerContext) {
    return next()
  }

  const raw = (req as any).originalUrl ?? req.path ?? (req as any).url ?? ""
  const path = typeof raw === "string" ? raw.split("?")[0] : ""
  const allowed = isAllowedForSeller(path)

  if (!allowed) {
    res.status(403).json({
      message: "Access restricted. Sellers do not have access to this area.",
    })
    return
  }

  return next()
}
