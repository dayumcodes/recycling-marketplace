import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type SellerRequest = MedusaRequest & {
  sellerContext?: { id: string; is_verified: boolean }
}

function normalizeAdminPath(req: MedusaRequest): string {
  const raw =
    (req as { originalUrl?: string }).originalUrl ??
    req.path ??
    (req as { url?: string }).url ??
    ""
  return typeof raw === "string" ? raw.split("?")[0] : ""
}

/**
 * Blocks seller admin users from creating products in Medusa Dashboard until
 * `is_verified` is true (platform admin verified them in Medusa or storefront admin).
 */
function isBlockedProductMutation(path: string, method: string): boolean {
  const m = method.toUpperCase()
  const isWriteMethod = m === "POST" || m === "PATCH" || m === "PUT" || m === "DELETE"
  if (!isWriteMethod) {
    return false
  }

  // The Medusa Admin "Add Product" flow can touch multiple endpoints
  // (product + variants) under these route prefixes.
  if (path.startsWith("/admin/products")) {
    return true
  }
  if (path.startsWith("/admin/product-variants")) {
    return true
  }

  return false
}

function isBlockedProductsPage(path: string, method: string): boolean {
  // The Medusa Admin "Products" UI loads `/admin/products` first, so block
  // unverified sellers from even viewing the page.
  const m = method.toUpperCase()
  if (m !== "GET") {
    return false
  }
  if (path === "/admin/products") {
    return true
  }
  // Block common details pages as well.
  if (path.startsWith("/admin/products/")) {
    return true
  }
  return false
}

export async function enforceVerifiedSellerCatalogWrites(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void | Promise<void>
): Promise<void> {
  const ctx = (req as SellerRequest).sellerContext
  if (!ctx) {
    return next()
  }

  const path = normalizeAdminPath(req)
  const method = req.method || "GET"

  const blocked =
    isBlockedProductMutation(path, method) ||
    isBlockedProductsPage(path, method)

  if (!blocked) {
    return next()
  }

  if (ctx.is_verified) {
    return next()
  }

  res.status(403).json({
    code: "seller_not_verified",
    message:
      "Your seller account must be verified by the platform before you can add products.",
  })
}
