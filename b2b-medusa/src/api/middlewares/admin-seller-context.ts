import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../modules/seller"

type AuthContext = { actor_type?: string; actor_id?: string }
type RequestWithAuth = MedusaRequest & {
  auth_context?: AuthContext
  sellerContext?: { id: string; is_verified: boolean }
}

/**
 * Resolves seller when the logged-in admin user is linked to a seller (admin_user_id).
 * Sets req.sellerContext and injects product/order list filters so sellers only see their own data.
 */
export async function adminSellerContext(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: () => void | Promise<void>
): Promise<void> {
  const auth = (req as RequestWithAuth).auth_context
  if (!auth?.actor_id || auth.actor_type !== "user") {
    return next()
  }

  
  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const sellers = await sellerModuleService.listSellers({
    admin_user_id: auth.actor_id,
  })
  if (!sellers.length) {
    return next()
  }

  const seller = sellers[0]
  ;(req as RequestWithAuth).sellerContext = {
    id: seller.id,
    is_verified: !!seller.is_verified,
  }

  const raw = (req as any).originalUrl ?? req.path ?? (req as any).url ?? ""
  const path = typeof raw === "string" ? raw.split("?")[0] : ""

  // #region agent log
  fetch('http://127.0.0.1:7613/ingest/ea5d5370-cab2-44a5-b9a3-a262579a2415',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'14c452'},body:JSON.stringify({sessionId:'14c452',runId:'product-isolation',hypothesisId:'H1',location:'admin-seller-context.ts:path-check',message:'path detection in adminSellerContext',data:{raw,path,reqPath:req.path,reqOriginalUrl:(req as any).originalUrl,method:req.method,sellerId:seller.id},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (path === "/admin/products" && req.method === "GET") {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    try {
      const { data: allProducts } = await query.graph({
        entity: "product",
        fields: ["id", "metadata"],
      })
      const sellerProductIds = (allProducts || [])
        .filter((p: any) => p.metadata?.seller_id === seller.id)
        .map((p: any) => p.id)

      // #region agent log
      fetch('http://127.0.0.1:7613/ingest/ea5d5370-cab2-44a5-b9a3-a262579a2415',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'14c452'},body:JSON.stringify({sessionId:'14c452',runId:'metadata-filter',hypothesisId:'H4',location:'admin-seller-context.ts:product-metadata-filter',message:'metadata-based product filter result',data:{sellerId:seller.id,totalProducts:(allProducts||[]).length,matchedCount:sellerProductIds.length,matchedIds:sellerProductIds},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (sellerProductIds.length > 0) {
        const q = req.query ?? {}
        ;(q as Record<string, unknown>)["id"] = sellerProductIds
        req.query = q
      } else {
        const q = req.query ?? {}
        ;(q as Record<string, unknown>)["id"] = ["__none__"]
        req.query = q
      }
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7613/ingest/ea5d5370-cab2-44a5-b9a3-a262579a2415',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'14c452'},body:JSON.stringify({sessionId:'14c452',runId:'metadata-filter',hypothesisId:'H4',location:'admin-seller-context.ts:product-filter-error',message:'product metadata query error',data:{sellerId:seller.id,error:err?.message},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }
  }

  if (path === "/admin/orders" && req.method === "GET") {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    try {
      const { data: allOrders } = await query.graph({
        entity: "order",
        fields: ["id", "metadata"],
      })
      const sellerOrderIds = (allOrders || [])
        .filter((o: any) => o.metadata?.seller_id === seller.id)
        .map((o: any) => o.id)

      // #region agent log
      fetch('http://127.0.0.1:7613/ingest/ea5d5370-cab2-44a5-b9a3-a262579a2415',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'14c452'},body:JSON.stringify({sessionId:'14c452',runId:'metadata-filter',hypothesisId:'H4',location:'admin-seller-context.ts:order-metadata-filter',message:'metadata-based order filter result',data:{sellerId:seller.id,totalOrders:(allOrders||[]).length,matchedCount:sellerOrderIds.length},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (sellerOrderIds.length > 0) {
        const q = req.query ?? {}
        ;(q as Record<string, unknown>)["id"] = sellerOrderIds
        req.query = q
      } else {
        const q = req.query ?? {}
        ;(q as Record<string, unknown>)["id"] = ["__none__"]
        req.query = q
      }
    } catch {
      // Order metadata query failed; skip filtering
    }
  }

  return next()
}
