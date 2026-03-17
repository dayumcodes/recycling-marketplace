import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

/**
 * Public route (not under /store) so it does not require x-publishable-api-key.
 * Used by the admin seller signup form to get the key for subsequent store API calls.
 */
export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const key =
    process.env.PUBLISHABLE_API_KEY ??
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ??
    ""
  const storefrontUrl =
    process.env.STOREFRONT_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:8000"
  res.json({ publishable_key: key, storefront_url: storefrontUrl })
}
