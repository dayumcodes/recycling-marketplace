import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import type { IUserModuleService } from "@medusajs/framework/types"

/**
 * Registers the current admin user in scope as `loggedInUser` when the request
 * is already authenticated (framework sets auth_context). Does not enforce auth;
 * the framework protects admin routes. This makes loggedInUser available for
 * workflows and other middlewares (e.g. adminSellerContext).
 */
export async function registerLoggedInUser(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
): Promise<void> {
  const session = (req as any).session
  const authContext = (req as any).auth_context ?? session?.auth_context
  const userId = authContext?.actor_id
  const actorType = authContext?.actor_type

  if (userId && actorType === "user") {
    try {
      const userModuleService: IUserModuleService = req.scope.resolve(Modules.USER)
      const user = await userModuleService.retrieveUser(userId)
      req.scope.register({
        loggedInUser: {
          resolve: () => user,
        },
      })
    } catch {
      // User may not exist; skip registering, let framework handle auth
    }
  }

  next()
}
