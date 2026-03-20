import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

function normalizeAdminPath(req: MedusaRequest): string {
  const raw =
    (req as { originalUrl?: string }).originalUrl ??
    req.path ??
    (req as { url?: string }).url ??
    ""
  return typeof raw === "string" ? raw.split("?")[0] : ""
}

/**
 * Ensures Medusa Admin `/admin/products` list responses include `metadata`.
 *
 * Your sellers are persisted into `product.metadata` (seller_id/seller_name/seller_handle).
 * Without `metadata` in the response, the Admin UI cannot display a "Seller" column.
 */
export async function adminProductsIncludeMetadata(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: () => void | Promise<void>
): Promise<void> {
  if ((req.method || "GET").toUpperCase() !== "GET") {
    return next()
  }

  const path = normalizeAdminPath(req)
  if (path !== "/admin/products") {
    return next()
  }

  const queryConfig = (req as any).queryConfig as
    | { fields?: unknown }
    | undefined

  const fields = queryConfig?.fields
  if (!fields) {
    return next()
  }

  if (Array.isArray(fields)) {
    if (!fields.includes("metadata")) {
      fields.push("metadata")
    }
    return next()
  }

  // Some code paths might treat `fields` as a comma-separated string.
  if (typeof fields === "string") {
    const parts = fields
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    if (!parts.includes("metadata")) {
      queryConfig.fields = [...parts, "metadata"].join(",")
    }
  }

  return next()
}

