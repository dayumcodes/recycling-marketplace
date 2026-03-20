import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../modules/seller"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const rows = await sellerModuleService.listSellers({})

  const byHandle = new Map<string, { id: string; name: string; handle: string }>()
  for (const s of rows) {
    const handle = (s.handle ?? "").trim()
    if (!handle || byHandle.has(handle)) {
      continue
    }
    byHandle.set(handle, {
      id: s.id,
      name: s.name ?? "",
      handle,
    })
  }

  const sellers = Array.from(byHandle.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  )

  res.json({ sellers })
}
