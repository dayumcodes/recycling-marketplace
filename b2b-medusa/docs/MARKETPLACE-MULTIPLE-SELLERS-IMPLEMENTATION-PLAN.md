# Detailed Implementation Plan: Multiple Sellers in Medusa Backend

**Goal (from b2b marketplace doc.md line 19):** Custom marketplace module so multiple **sellers (recyclers)** can list materials and fulfill orders; each seller has **isolated products, orders**, and **optional store profile**.

**Approach:** Extend the existing Seller module. No plugin; no refactor to Store/Admin User. Sellers remain Customers with a Seller profile.

---

## 1. Current State (What Already Exists)

### 1.1 Backend (`b2b-medusa`)

| Component | Location | Purpose |
|-----------|----------|---------|
| Seller model | `src/modules/seller/models/seller.ts` | Entity: id, name, handle, user_id (→ customer), description, is_verified. |
| Seller module | `src/modules/seller/index.ts`, `service.ts` | Module registration; CRUD via sellerModuleService. |
| Product–Seller link | `src/links/product-seller.ts` | Links Medusa Product to Seller (product ↔ seller). Used for “my products” and admin link-seller. |
| Admin sellers API | `src/api/admin/sellers/route.ts` (GET list, POST create), `src/api/admin/sellers/[id]/route.ts` (GET one, PATCH update) | List/create/update sellers from admin. |
| Admin link product to seller | `src/api/admin/products/[id]/link-seller/route.ts` | POST/DELETE to link/unlink a product to a seller via REMOTE_LINK. |
| Store sellers “me” | `src/api/store/sellers/me/route.ts` | GET current seller for authenticated customer. |
| Store sellers “me” products | `src/api/store/sellers/me/products/route.ts` | GET list products (filter by metadata.seller_id); POST create product with metadata.seller_id and product–seller link. |
| Store platform-admin sellers | `src/api/store/platform-admin/sellers/route.ts` | List sellers and update is_verified (for storefront platform admin). |
| Store product/seller helpers | `src/api/store/seller-by-product-ids/route.ts`, `src/api/store/product-ids-by-seller/route.ts` | Resolve seller by product (metadata) and product IDs by seller. |
| Middlewares | `src/api/middlewares.ts` | Authenticate customer for `/store/sellers/me*` and `/store/platform-admin/*`. |
| Config | `medusa-config.ts` | sellerModule registered with `isQueryable: true`. |
| Admin customizations | `src/admin/` | README and base setup for widgets; no Sellers page or routes yet. |

**Gaps for full doc line 19:**

- **Orders** are not yet scoped to a seller (no order–seller link; no “my orders” for seller).
- **Medusa Admin UI** has no “Sellers” menu or page (only API exists).
- Optional: product-created hook to ensure product–seller link is always set when created via seller flow (currently set in route; hook can reinforce or centralize).

---

## 2. Implementation Plan (Backend Only – Medusa)

All steps below are in **`b2b-medusa`**. No code—only what to add or change and where.

---

### Phase A: Order–Seller Relationship

**A1. Define Order–Seller link**

- **Create** a new link file: `src/links/order-seller.ts`.
- **Pattern:** Same structure as `src/links/product-seller.ts`: use `defineLink` from `@medusajs/framework/utils`, link Medusa’s Order module (`@medusajs/medusa/order`) with the local Seller module (`../modules/seller`).
- **Cardinality:** One order can be associated with one seller (single-seller-per-order model). Choose `isList: false` for the seller side so each order links to one seller. If multi-seller orders are required later, the link can be extended (e.g. order ↔ many sellers or use line-item-level seller only).
- **No** `src/links/index.ts` is required if the project auto-loads all files in `src/links/` (current repo has only `product-seller.ts` and no index).

**A2. Register and sync the link**

- **Config:** Confirm in Medusa v2 docs whether links in `src/links/` are auto-discovered. If the project uses explicit link registration, add the new order–seller link to that registration (e.g. in `medusa-config.ts` or a dedicated links manifest if present).
- **Database:** Run `npx medusa db:sync-links` so the join table for order–seller is created. If the project uses migrations for links, run the appropriate migration command instead.

**A3. Create workflow: link order to seller**

- **Create** workflow directory and files (the repo currently has no `src/workflows/`):
  - `src/workflows/link-order-to-seller/index.ts` — define a workflow that accepts `orderId` and `sellerId`, and creates the order–seller link.
  - `src/workflows/link-order-to-seller/steps/link-order-to-seller.ts` — step that uses `ContainerRegistrationKeys.REMOTE_LINK` (or the same link API used in `link-seller` route) to create the link between the order and the seller. Include compensation (dismiss link) in the step for rollback.
- **Input:** orderId (from Medusa order), sellerId (from Seller module). Output: link created (and stored in the link table).

**A4. Hook into order creation**

- **Create** `src/workflows/hooks/order-created.ts` (or equivalent under `src/workflows/hooks/`).
- **Subscribe** to Medusa’s `createOrdersWorkflow.hooks.orderCreated` (exact hook name per Medusa v2 docs).
- **Handler logic (conceptual):**
  - Receive the created order (and optionally line items) from the hook payload.
  - Resolve the seller for this order:
    - **Option 1 (recommended):** From the first (or only) line item’s product: get product id → read product metadata `seller_id` (products created via `sellers/me/products` already have this). If multiple line items from different sellers, decide policy: e.g. use first item’s seller, or support multi-seller later.
    - **Option 2:** If order metadata or custom field already stores `seller_id`, use that.
  - If a seller_id is resolved, run the `link-order-to-seller` workflow with `orderId` and `sellerId`.
- **Scope:** Ensure the hook runs in a context where it can resolve the link and seller module (e.g. from container/scope). No need for “logged in user” in this hook—seller comes from order/content.

**A5. “My orders” API for seller**

- **Create** `src/api/store/sellers/me/orders/route.ts`.
- **Method:** GET only (list orders for the current seller).
- **Auth:** Reuse existing customer auth (same as `sellers/me` and `sellers/me/products`). Ensure `src/api/middlewares.ts` applies customer authentication to `/store/sellers/me/*` (current matcher `"/store/sellers/me*"` already covers `/store/sellers/me/orders`).
- **Logic (conceptual):**
  - Resolve authenticated customer id from request auth context.
  - Resolve seller for this customer: call sellerModuleService.listSellers({ user_id: customerId }); if none, return 403.
  - Fetch orders that are linked to this seller. Use Medusa’s query API or order module with the order–seller link: filter orders by seller_id via the link (entry point and field names per your link definition). Return list of orders (with desired fields: id, status, items, created_at, etc.).
- **Response:** JSON array of orders (or paginated object if the project standard is pagination).

---

### Phase B: Medusa Admin UI – Sellers Visible in Backend

**B1. Confirm admin extension structure**

- The repo has `src/admin/` with README describing widgets and “new pages.” Medusa v2 admin supports **routes** (custom pages) and **widgets**. For a full “Sellers” list page, a **custom route** is needed.
- **Check** Medusa v2 docs for “Admin custom routes” or “Admin UI routes”: how to register a new route (path like `/app/sellers`) and add a sidebar entry. Typically this is done via a route config and a sidebar/navigation config (e.g. under `src/admin/`).

**B2. Create Sellers list page**

- **Create** a new admin page component, e.g. `src/admin/routes/sellers/page.tsx` (or the path your Medusa admin uses for custom routes—could be `src/admin/pages/sellers.tsx` or similar; refer to project or Medusa admin extension docs).
- **Behavior:** The page fetches `GET /admin/sellers` (your existing API). Display the list in a table: columns e.g. name, handle, user_id (or resolved customer email if you add it), is_verified, created_at. Add loading and error states. Optionally add a link to a detail page for each seller (e.g. `/app/sellers/:id`).

**B3. Create Seller detail page (optional)**

- **Create** e.g. `src/admin/routes/sellers/[id]/page.tsx` (or equivalent). Fetch `GET /admin/sellers/:id`. Show seller fields and optionally list of product IDs or orders linked to this seller (calling existing or new admin APIs as needed).

**B4. Register route and sidebar**

- **Register** the new route(s) so the Medusa Admin app serves them (e.g. at `/app/sellers` and `/app/sellers/:id`). Registration method depends on Medusa v2 admin SDK (e.g. `defineRouteConfig` or similar).
- **Add** a sidebar entry under **Extensions** (or equivalent) with label “Sellers” (or “Merchants”) that navigates to the Sellers list page. This makes “multiple sellers visible in the Medusa backend” as requested.

**B5. No changes to existing admin API**

- Keep using `src/api/admin/sellers/route.ts` and `src/api/admin/sellers/[id]/route.ts` as-is. No new backend API files are required for the Sellers UI; only the admin front-end pages and routing.

---

### Phase C: Optional Improvements (Backend)

**C1. Product-created hook (optional)**

- **Create** `src/workflows/hooks/product-created.ts`.
- **Subscribe** to `createProductsWorkflow.hooks.productsCreated`.
- **Purpose:** Ensure every product created (including from admin) can be optionally linked to a seller. If the product is created from the store route `sellers/me/products`, the route already sets metadata and link; this hook can be used to normalize or backfill the product–seller link when product is created elsewhere with metadata.seller_id. Handler: read product id and metadata.seller_id from payload; if seller_id present, create product–seller link via the same link API used in `link-seller` route. If no seller_id, skip.

**C2. Seller-scoped admin filtering (optional, later)**

- If you want vendors (sellers) to log in to Medusa Admin and see only their own products/orders, you would:
  - Add a way to associate an Admin User with a Seller (e.g. user_id on Seller pointing to admin user, or a separate User–Seller link).
  - Add middlewares for GET `/admin/products` and GET `/admin/orders` that resolve the current admin user’s seller and inject a filter (e.g. by product–seller and order–seller link) so only that seller’s data is returned. This is not required for “multiple sellers visible in the Medusa backend”; it only matters if sellers use Medusa Admin.

**C3. Seed data (optional)**

- If you have `src/scripts/seed.ts` or `seed-sellers.ts`, optionally extend them to create order–seller links for any seeded orders whose line items have products with metadata.seller_id, so dev data is consistent.

---

## 3. Files Summary (Backend – b2b-medusa)

| Action | File(s) |
|--------|--------|
| **Create** | `src/links/order-seller.ts` |
| **Create** | `src/workflows/link-order-to-seller/index.ts`, `src/workflows/link-order-to-seller/steps/link-order-to-seller.ts` |
| **Create** | `src/workflows/hooks/order-created.ts` |
| **Create** | `src/api/store/sellers/me/orders/route.ts` |
| **Create** | `src/admin/routes/sellers/page.tsx` (or project-equivalent path) |
| **Create** (optional) | `src/admin/routes/sellers/[id]/page.tsx` |
| **Create** (optional) | `src/workflows/hooks/product-created.ts` |
| **Edit** | Admin route/sidebar registration (path per Medusa admin docs; may be inside `src/admin/` config or a single entry file). |
| **Edit** (if required) | `medusa-config.ts` or link registration, only if links are not auto-discovered. |
| **No change** | `src/modules/seller/*`, `src/links/product-seller.ts`, `src/api/admin/sellers/*`, `src/api/store/sellers/*`, `src/api/admin/products/[id]/link-seller/route.ts`, `src/api/middlewares.ts` (matcher already covers `/store/sellers/me*`). |

---

## 4. Out of Scope for This Plan (Storefront)

- Storefront “My orders” page and data layer (`b2b-medusa-storefront`) are not part of this backend-only plan.
- Public store profile page (`/seller/[handle]`) and any storefront admin/seller dashboard changes are also out of scope here.

---

## 5. Order of Implementation

1. **A1–A2:** Add order–seller link and sync DB.
2. **A3:** Implement link-order-to-seller workflow and step.
3. **A4:** Implement order-created hook that resolves seller from order/line items and runs the workflow.
4. **A5:** Implement GET `/store/sellers/me/orders`.
5. **B1–B4:** Add Medusa Admin Sellers page(s) and sidebar entry.
6. **C1–C3:** Optional hooks and seeds as needed.

---

## 6. Success Criteria

- **Multiple sellers:** Already supported (Seller model + admin and store APIs).
- **Isolated products:** Already supported (product metadata + product–seller link; filter in `sellers/me/products`).
- **Isolated orders:** Achieved after Phase A (order–seller link + “my orders” API).
- **Optional store profile:** Already supported (Seller name, handle, description); no backend change required.
- **Sellers visible in Medusa backend:** Achieved after Phase B (Sellers list and optional detail page in Medusa Admin sidebar).

This plan is codebase-contextual and does not contain code; it describes what to implement and where in the Medusa backend only.
