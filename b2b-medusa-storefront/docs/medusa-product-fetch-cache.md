# Medusa `/store/products` fetch caching (storefront)

Product listing uses `listProducts` and `listProductsWithSort` in `src/lib/data/products.ts`. Caching is controlled by:

| Variable | Purpose |
|----------|---------|
| `MEDUSA_STORE_PRODUCTS_CACHE` | `revalidate` (default), `no-store`, or `force-cache` |
| `MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS` | Revalidate interval when mode is `revalidate` (default `60`) |

**Default (`revalidate`)** refreshes cached list data on a timer instead of holding a bad `force-cache` entry indefinitely (common after deploy / env fixes).

**Production override examples (Azure App Settings):**

- Fresh lists, no HTTP cache: `MEDUSA_STORE_PRODUCTS_CACHE=no-store`
- Previous behavior: `MEDUSA_STORE_PRODUCTS_CACHE=force-cache`
- Faster refresh: `MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS=30`

## `/api/marketplace-debug`

Diagnostics: region resolution + one marketplace-shaped `/store/products` request.

- **Local:** `GET /api/marketplace-debug?countryCode=ae`
- **Production:** set `MARKETPLACE_DEBUG_SECRET` in App Settings, then  
  `GET /api/marketplace-debug?countryCode=ae&secret=<same value>`  
  Without a secret in production, the route returns **404**.

Remove the secret or unset it when finished debugging.

`/api/health` includes non-secret summaries of these env vars.
