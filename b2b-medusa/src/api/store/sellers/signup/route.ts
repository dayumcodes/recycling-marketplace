import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import {
  createCustomerAccountWorkflow,
  createUserAccountWorkflow,
} from "@medusajs/medusa/core-flows"
import { SELLER_MODULE } from "../../../../modules/seller"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = req.body as {
    email: string
    password: string
    first_name?: string
    last_name?: string
    name: string
    handle: string
    description?: string
  }

  const { email, password, first_name, last_name, name, handle, description } = body
  if (!email?.trim() || !password || !name?.trim() || !handle?.trim()) {
    return res.status(400).json({
      message: "email, password, name, and handle are required",
    })
  }

  const sellerModuleService = req.scope.resolve(SELLER_MODULE)
  const handleExists = await sellerModuleService.listSellers({ handle })
  if (handleExists.length > 0) {
    return res.status(400).json({ message: "Handle already taken" })
  }

  const authModuleService = req.scope.resolve(Modules.AUTH) as {
    register: (provider: string, data: { url: string; headers: Record<string, unknown>; query: Record<string, unknown>; body: Record<string, unknown>; protocol: string }) => Promise<{ success: boolean; authIdentity?: { id: string }; error?: string }>
  }

  const baseUrl = `${req.protocol || "http"}://${req.get("host") || "localhost:9000"}`
  const registerResult = await authModuleService.register("emailpass", {
    url: `${baseUrl}/auth/customer/emailpass/register`,
    headers: req.headers as Record<string, unknown>,
    query: (req.query || {}) as Record<string, unknown>,
    body: { email: email.trim(), password },
    protocol: req.protocol || "http",
  })

  if (!registerResult.success || !registerResult.authIdentity?.id) {
    const msg = registerResult.error || "Registration failed"
    if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("identity")) {
      return res.status(409).json({ message: "An account with this email already exists" })
    }
    return res.status(400).json({ message: msg })
  }

  const authIdentityId = registerResult.authIdentity.id

  const { result: customer } = await createCustomerAccountWorkflow(req.scope).run({
    input: {
      authIdentityId,
      customerData: {
        email: email.trim(),
        first_name: (first_name ?? "").trim() || name.trim(),
        last_name: (last_name ?? "").trim(),
      },
    },
  })

  // Use the same auth identity for admin user so one identity has both customer_id and user_id.
  // register("user") with same email would fail with "Identity with email already exists"; session
  // would then have actor_type "user" but empty actor_id. So we attach the user to the existing identity.
  let adminUser: { id: string } | null = null
  const { result: user } = await createUserAccountWorkflow(req.scope).run({
    input: {
      authIdentityId,
      userData: {
        email: email.trim(),
        first_name: (first_name ?? "").trim() || name.trim(),
        last_name: (last_name ?? "").trim(),
      },
    },
  })
  adminUser = user

  const [seller] = await sellerModuleService.createSellers([
    {
      name: name.trim(),
      handle: handle.trim(),
      user_id: customer.id,
      admin_user_id: adminUser?.id ?? null,
      description: (description ?? "").trim() || null,
    },
  ])

  return res.status(201).json({
    message: "Seller account created",
    customer: { id: customer.id, email: customer.email, first_name: customer.first_name, last_name: customer.last_name },
    seller: { id: seller.id, name: seller.name, handle: seller.handle },
  })
}
