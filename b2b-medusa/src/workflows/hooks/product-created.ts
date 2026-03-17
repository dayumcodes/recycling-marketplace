import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../modules/seller"

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    let loggedInUser: any
    try {
      loggedInUser = container.resolve("loggedInUser")
    } catch {
      return
    }
    if (!loggedInUser?.id) return

    const sellerModuleService = container.resolve(SELLER_MODULE) as any
    const sellers = await sellerModuleService.listSellers({
      admin_user_id: loggedInUser.id,
    })
    if (!sellers.length) return

    const seller = sellers[0]
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    // #region agent log
    fetch('http://127.0.0.1:7613/ingest/ea5d5370-cab2-44a5-b9a3-a262579a2415',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'14c452'},body:JSON.stringify({sessionId:'14c452',runId:'product-isolation',hypothesisId:'H2',location:'product-created.ts:hook',message:'productsCreated hook fired',data:{sellerId:seller.id,sellerName:seller.name,productCount:products.length,productIds:products.map((p: any) => p.id)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    for (const product of products) {
      try {
        await link.create({
          [Modules.PRODUCT]: { product_id: product.id },
          [SELLER_MODULE]: { seller_id: seller.id },
        })
      } catch (err: any) {
        // #region agent log
        fetch('http://127.0.0.1:7613/ingest/ea5d5370-cab2-44a5-b9a3-a262579a2415',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'14c452'},body:JSON.stringify({sessionId:'14c452',runId:'product-isolation',hypothesisId:'H2',location:'product-created.ts:link-error',message:'link creation error',data:{productId:product.id,sellerId:seller.id,error:err?.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      }

      try {
        const productModuleService = container.resolve(Modules.PRODUCT) as any
        await productModuleService.updateProducts(product.id, {
          metadata: {
            seller_id: seller.id,
            seller_name: seller.name,
            seller_handle: seller.handle,
          },
        })
      } catch {
        // Metadata update is best-effort for backward compatibility
      }
    }
  }
)
