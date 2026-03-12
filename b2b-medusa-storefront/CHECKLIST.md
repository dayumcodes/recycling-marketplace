# ScrapCircle Build Checklist

**Source of truth:** `plan.md` in this repo.

---

## ✅ Completed

### Phase 1 – Skeleton & Theming
- [x] Routes: `/`, `/about`, `/services`, `/impact`, `/blog`, `/blog/[slug]`, `/contact`, `/marketplace`
- [x] Header: ScrapCircle logo (left), nav links + Schedule Pickup + Cart + Menu (right), white text, compact height
- [x] Footer: Company, Our Services, Site Info, Contact columns; ScrapCircle branding
- [x] Tailwind: `primary`, `accent` colors added to `tailwind.config.js`

### Phase 2 – Home & Core Marketing
- [x] Hero: “Transform Waste into Value”, Sell Scrap / Buy Recyclables CTAs, Recent Marketplace Activity card
- [x] Impact stats bar: Tons Recycled, Transactions Secured, CO₂ Reduced
- [x] Browse by Material: 6 category cards linking to `/marketplace`
- [x] Three Pillars: Zero Waste, Sustainability, Circular Economy (from `lib/marketing-data.ts`)
- [x] About teaser: mission copy + “Know More” → `/about`
- [x] B2B Solutions: 3 service cards (Commercial Scrap, Large-Scale, Recycling Marketplace) with links
- [x] Impact narrative: 4 subsections (Eco-warriors, Economic Prosperity, Environmental Excellence, Circular Economy)
- [x] Cities: live cities + coming soon (from `lib/marketing-data.ts`)
- [x] Testimonials: 4 cards (from `lib/marketing-data.ts`)
- [x] Bottom CTA: “Put your SCRAP to Work” → `/marketplace`
- [x] `lib/marketing-data.ts`: PILLARS, SERVICES, CITIES, SCRAP_CATEGORIES, IMPACT_STATS, TESTIMONIALS, ABOUT_TEASER, IMPACT_NARRATIVE, BOTTOM_CTA
- [x] Marketing components: SectionTitle, StatCard, PillarCard, ServiceCard, CityGrid, ScrapCategoryGrid, TestimonialCard, CTASection

### Phase 3 – Supporting Pages
- [x] `/about`: “Turning Scrap into Treasure” + why we exist / tech
- [x] `/services`: For Residents, For Businesses, Commercial, Large-Scale, B2B Marketplace
- [x] `/impact`: stats + narrative sections
- [x] `/blog`: index from `lib/blog-data.ts`
- [x] `/blog/[slug]`: post detail from `getPostBySlug()`
- [x] `/contact`: form with Full Name, Phone, City, Customer type, Timeline, Message
- [x] Contact form: server action `submitContactForm` (logs submission, returns success/error message)

### Phase 4 – Marketplace Integration
- [x] `/marketplace`: wraps StoreTemplate with ScrapCircle intro copy
- [x] Product detail: “Request Quote” button → `/contact?product=<handle>`
- [ ] Configure categories/products in Medusa Admin to match scrap taxonomy (manual in Admin)
- [ ] Category filtering on `/marketplace` by query param (frontend can pass `?category=`, backend filtering depends on Medusa categories)

### Commerce (unchanged, working)
- [x] Cart, checkout, account, store, categories, collections, product detail (Medusa flows intact)
- [x] FeaturedProducts on home (collections from Medusa)

---

## ⏳ Remaining

### Storefront (optional polish)
- [ ] Animated counters for impact stats (CSS or small hook)
- [ ] Contact form: persist submissions (e.g. email, DB, or API) instead of console log
- [ ] Pre-fill contact form when opened via “Request Quote” with `?product= handle`

### Medusa Admin (manual)
- [ ] Create product categories matching scrap taxonomy (paper, plastic, aluminium, etc.)
- [ ] Add sample products per category for marketplace listing

### Phase 5 – B2B & Marketplace (later)
- [ ] Medusa B2B recipe: companies, approval, price lists
- [ ] Quote/RFQ workflow (request → response → order)
- [ ] Multi-vendor: seller entity, “sold by”, seller dashboard

---

## Additional implementation phases (no code yet)

*Used to implement: (1) multiple users with their own products, (2) adding products. Reference: `b2b marketplace doc.md`, `b2b marketplace timeline.md`, `plan.md`.*

### Current state (read from codebase)

- **Backend (`b2b-medusa`):** Vanilla Medusa v2. Single store, single sales channel, one publishable key. Products are **global** (no `seller_id` / `store_id`). Admin users can create products; there is **no** concept of “this product belongs to this user/seller.” Seed (`src/scripts/seed.ts`) creates one store, regions, stock location, and four sample products (T-Shirt, Sweatshirt, Sweatpants, Shorts) in categories Shirts, Sweatshirts, Pants, Merch.
- **Storefront:** Single catalog from Medusa; FeaturedProducts and marketplace use the same product list. No “sold by” or per-seller filtering.
- **Conclusion:** Today you **cannot** have multiple users each with their own products in the backend; that requires marketplace/seller scoping (see Phase A below). You **can** add products today via Medusa Admin or by extending the seed (see Phase B).

---

### Phase A – Multiple users with their own products (backend + storefront)

**Goal:** Each “seller” (user) has their own set of products; storefront shows aggregated catalog with “sold by” and optional seller profile.

| Step | Scope | Tasks |
|------|--------|--------|
| A.1 | Backend – Marketplace model | Integrate [Medusa Marketplace recipe](https://docs.medusajs.com/resources/recipes/marketplace) or equivalent so products (and optionally orders) are scoped to a **seller/store** (e.g. `store_id` or custom seller entity). One store per seller or one “vendor” entity linked to products. |
| A.2 | Backend – Seller identity | Define seller: either (a) Medusa **Store** per seller, or (b) custom **Seller** module/entity linked to **User** (admin/invite) and to **Product** (e.g. `product.seller_id`). Ensure Admin API and Store API can filter by seller/store. |
| A.3 | Backend – Auth & RBAC | Seller onboarding and auth: invite or register sellers; middleware/guard so seller-scoped admin/dashboard APIs only return that seller’s products/orders. |
| A.4 | Backend – Store API | Store API (for storefront): list products from all sellers with `store_id` or `seller_id` (or equivalent) in response so storefront can show “sold by [Seller]”. Optional: seller profile endpoint (name, link). |
| A.5 | Storefront | Marketplace listing: show “sold by” and optional link to seller; optional filter by seller. Product detail: show seller info. No change to cart/checkout until B2B/quote is in place (orders can still be single-seller or platform-managed). |
| A.6 | Admin / Seller dashboard | Admin: list sellers, assign products to sellers (or sellers create their own if you add seller dashboard). Optional: separate seller dashboard (Next.js or Admin UI extension) for sellers to manage only their products and orders. |

**Dependencies:** Phase A.1–A.2 are required before “multiple users with their own products” is possible. A.3–A.6 refine access and UX.

---

### Phase B – Adding products (no multi-seller)

**Goal:** Have more products in the catalog quickly (single-tenant, current model). Two paths: manual in Admin, or seed/script.

| Step | Scope | Tasks |
|------|--------|--------|
| B.1 | Manual (Medusa Admin) | Use Medusa Admin: create categories (e.g. scrap taxonomy: paper, plastic, aluminium), then create products with title, handle, description, images, variants, prices, category. Attach to Default Sales Channel so they appear on the storefront. No code change. |
| B.2 | Seed script (backend) | Extend `b2b-medusa/src/scripts/seed.ts` (or add a new script): call `createProductCategoriesWorkflow` and `createProductsWorkflow` with extra categories (e.g. scrap materials) and extra products (e.g. scrap listings with handle, title, description, variants/prices). Run via `medusa exec ./src/scripts/seed.ts` (or your script). Keeps one store; products remain global. |
| B.3 | Align with scrap taxonomy (optional) | If you want categories to match “Browse by Material”: create categories in Admin or seed that match `lib/marketing-data.ts` (e.g. SCRAP_CATEGORIES). Add products to those categories so `/marketplace` and category filters (when implemented) show them. |
| B.4 | Storefront category filter | Once categories exist: add category filtering on `/marketplace` (e.g. `?category=<id or handle>`) and wire Store API to filter by category. CHECKLIST Phase 4 already lists this. |

**Dependencies:** B.1 is immediate. B.2 requires only backend seed/script changes. B.3–B.4 improve discovery and align with ScrapCircle taxonomy.

---

### Phase C – Adding products in a multi-seller world (after Phase A)

**Goal:** Once Phase A is done, “adding products” is per seller: each seller adds their own products.

| Step | Scope | Tasks |
|------|--------|--------|
| C.1 | Seller-scoped product create | Admin or seller dashboard: create product linked to current seller (e.g. `store_id` or `seller_id`). Only that seller sees/edits it in their scope. |
| C.2 | Store API | List products across all sellers; each product includes seller/store info for “sold by” and filtering. |
| C.3 | Optional: bulk/import | Allow sellers (or admin) to bulk-add products (CSV/import) scoped to the seller. |

---

### Summary

| Question | Answer |
|----------|--------|
| Can we have multiple users with their own products in the backend? | **Foundation in place.** Seller module and Product–Seller link exist; seller-scoped APIs and storefront "sold by" still to do (Phase A.4–A.6). |
| Can we have some products added? | **Yes.** Seed includes scrap categories + sample scrap products (Phase B.2–B.3). Marketplace supports `?category=<handle>` and "Browse by material" filter (Phase B.4). |

### Implementation status (done)

- **Currency:** Store and primary region use **AED** (UAE). Seed: `supported_currencies` = AED; UAE region + Europe; all product and shipping prices in AED.
- **Phase B:** Seed extended with scrap categories (Paper, Plastic, Aluminium, …) aligned with `SCRAP_CATEGORIES`, plus sample scrap products in AED. Marketplace supports **category filter** via `?category=<handle>` and "Browse by material" links.
- **Phase A (multi-seller – implemented):**
  - **Backend:** Seller module + Product–Seller link; seed creates 3 sellers and links first 3 products to them. Store API: `GET /store/sellers`, `GET /store/seller-by-product-ids?ids=...`, `GET /store/product-ids-by-seller?handle=...`. Admin API: `GET/POST /admin/sellers`, `POST/DELETE /admin/products/:id/link-seller` (body: `seller_id`).
  - **Storefront:** "Sold by [name]" on product preview (marketplace, featured, related) and product detail; marketplace **filter by seller** via `?seller=<handle>` and "Sold by" links; data layer `getSellers`, `getSellersByProductIds`, `getProductIdsBySellerHandle`.
  - **Auth/RBAC (A.3) and seller dashboard (A.6):** Not implemented; admin can assign sellers to products via API. Optional next: seller login and scope admin by seller.

---

### What to do from your side

1. **Backend (b2b-medusa)**  
   - Ensure DB is up and run migrations for the Seller module and link:  
     `npx medusa db:generate sellerModule` then `npx medusa db:migrate`.  
   - Seed sellers (safe to re-run, skips if sellers exist):  
     `medusa exec ./src/scripts/seed-sellers.ts`  
   - (On a **fresh** DB only: `npm run seed` first to create regions, products, etc.)  
   - Start backend: `npm run dev` (or your usual command).

2. **Storefront (b2b-medusa-storefront)**  
   - Set `MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `.env.local` to point to the backend.  
   - Run and open the marketplace: you should see "Sold by" on products that are linked to a seller, and "Browse by material" / "Sold by" filters.

3. **Assigning products to sellers (admin)**  
   - List sellers: `GET /admin/sellers`.  
   - Create seller: `POST /admin/sellers` with body `{ "name": "...", "handle": "..." }`.  
   - Link product to seller: `POST /admin/products/:productId/link-seller` with body `{ "seller_id": "..." }`.  
   - Unlink: `DELETE /admin/products/:productId/link-seller` with body `{ "seller_id": "..." }`.  
   - (Optional) Add a small Admin UI or script that calls these endpoints so non-technical users can manage sellers and links.)

4. **Optional next steps (not in codebase yet)**  
   - Seller auth and RBAC: restrict admin (or a seller dashboard) so each seller only sees/edits their own products.  
   - Seller onboarding: invite or self-serve registration for new sellers.

-----------------------------------------------------------------------------
<!-- ----------------------------------------------------------------------------- -->

Here’s a single implementation plan for **multiple sellers** that matches the docs and the current codebase.

---

# Multiple Sellers Implementation Plan

*Based on: `b2b marketplace doc.md`, `b2b marketplace timeline.md`, root `plan.md`, `b2b-medusa-storefront/plan.md`, and `b2b-medusa-storefront/CHECKLIST.md`.*

---

## 1. Current state (what’s already there)

### Backend (`b2b-medusa`)

| Done | Location / detail |
|------|-------------------|
| **Seller entity** | Custom module `src/modules/seller/`: model `Seller` (id, name, handle), `SellerModuleService`, `SELLER_MODULE`, registered in `medusa-config.ts` with `isQueryable: true`. |
| **Product–Seller link** | `src/links/product-seller.ts`: Product ↔ Seller (many-to-one). Migrations: `db:generate sellerModule`, `db:migrate`. |
| **Store API (buyer storefront)** | `GET /store/sellers`, `GET /store/seller-by-product-ids?ids=`, `GET /store/product-ids-by-seller?handle=`. |
| **Admin API (platform admin)** | `GET/POST /admin/sellers`, `POST/DELETE /admin/products/:id/link-seller` (body: `seller_id`). |
| **Seed** | `seed-sellers.ts` creates 3 sellers and links first N products; main `seed.ts` can create sellers+links when run on a fresh DB. |

So: **multi-seller data model and “sold by” APIs are in place.** Products are still created globally in Admin; linking to a seller is a separate step (no seller-scoped product creation yet).

### Storefront (`b2b-medusa-storefront`)

| Done | Location / detail |
|------|-------------------|
| **Data layer** | `lib/data/sellers.ts`: `getSellers()`, `getSellersByProductIds()`, `getProductIdsBySellerHandle()` (with try/catch so missing backend routes don’t crash the app). |
| **Marketplace** | `app/[countryCode]/(main)/marketplace/page.tsx`: category + seller from query; fetches sellers and optional `productsIds` by seller; passes to `CategoryFilter` and `StoreTemplate`. |
| **Filters** | `modules/marketplace/components/category-filter.tsx`: “Browse by material” (category) + “Sold by” (seller pills when `sellers.length > 0`). |
| **Product display** | “Sold by {seller.name}” in `product-preview/index.tsx`, `product-info/index.tsx`; featured and related products use `getSellersByProductIds`. |
| **Commerce** | Single cart/checkout (no per-seller split yet); `/store` redirects to `/marketplace`. |

So: **buyer-facing “multiple sellers” (list, filter, “sold by”) is implemented.** What’s missing is **who** creates sellers and products and **how** (admin-only vs seller self-service).

---

## 2. How multiple sellers are supposed to work (from the docs)

From **doc.md** and **timeline**:

- **Sellers** = recyclers/scrap dealers who list materials, respond to RFQs, fulfill orders.
- **Buyers** = browse by material/grade, see “sold by”, request quotes, place orders.
- **Platform admin** = onboard/verify sellers, manage catalog, disputes, fees.
- **Marketplace:** products and orders scoped to seller; storefront shows aggregated catalog with “sold by” and seller profile; seller dashboard and API filtered by seller (e.g. `?store_id=` or seller_id).

So the target is: **multiple sellers, each with their own products and orders, with clear “sold by” and optional seller profile, and later seller dashboard + B2B (quotes/RFQ).**

---

## 3. Implementation plan (backend + storefront)

Phasing below matches **CHECKLIST Phase A/B/C**, **timeline Phase 2 (marketplace)** and **Phase 6 (seller dashboard)**, and **storefront plan Phase 5**.

---

### Phase A (multiple sellers) – status and remaining

| Step | Scope | Status | What to do in `b2b-medusa` / `b2b-medusa-storefront` |
|------|--------|--------|-------------------------------------------------------|
| **A.1** | Backend – marketplace model | ✅ Done | Custom Seller module + Product–Seller link (no Marketplace recipe; custom approach as in CHECKLIST). |
| **A.2** | Backend – seller identity | ✅ Done | Seller entity (id, name, handle). Link is Product → Seller. No User ↔ Seller link yet (needed for A.3). |
| **A.3** | Backend – auth & RBAC | ❌ Not done | **b2b-medusa:** (1) Link Seller to Medusa User (e.g. `user_id` on Seller or dedicated link). (2) Seller onboarding: invite (admin creates User + Seller and links them) or self-serve (registration flow that creates User + Seller). (3) Auth: use Medusa admin auth (or custom) for “seller” role; middleware/guard on admin (or seller) routes so that seller-scoped APIs only return that seller’s products/orders. (4) RBAC: distinguish admin vs seller; sellers can only see/edit their own products and orders. |
| **A.4** | Backend – Store API | ✅ Done | Store API already lists products with seller info and supports filtering by seller (product-ids-by-seller). Optional: seller profile endpoint (e.g. `GET /store/sellers/:handle` with name, link, optional certifications) for storefront seller pages. |
| **A.5** | Storefront | ✅ Done | Marketplace shows “sold by”, filter by seller; product detail shows seller. Optional: **b2b-medusa-storefront:** seller profile page (e.g. `/marketplace/seller/[handle]`) showing seller name + their products (call `getProductIdsBySellerHandle` + product list). |
| **A.6** | Admin / seller dashboard | ⏳ Partial | **Admin:** Today only API; no Medusa Admin UI for Sellers. **b2b-medusa:** Optional: Admin UI extension (custom page in Medusa Admin) to list sellers, create seller, assign products to seller (calls existing `GET/POST /admin/sellers`, `POST/DELETE /admin/products/:id/link-seller`). **Seller dashboard:** **b2b-medusa:** Seller-scoped Admin (or separate) API: list/update own products, list own orders, respond to RFQs (when B2B exists). **b2b-medusa-storefront** (or separate app): Seller dashboard app: login as seller → see only own listings and orders; create/edit products (calls backend product create + link to current seller). |

So: **multiple sellers are “implemented” for the buyer side (list, filter, “sold by”).** Remaining work is **identity (User–Seller), auth, RBAC, admin UI for sellers, and seller dashboard.**

---

### Phase B (adding products) – status and remaining

| Step | Scope | Status | Notes |
|------|--------|--------|--------|
| B.1 | Manual in Admin | ✅ | Create categories/products in Medusa Admin; attach to sales channel. |
| B.2 | Seed script | ✅ | `seed.ts` + scrap categories/products; `seed-sellers.ts` for sellers + links. |
| B.3 | Scrap taxonomy | ✅ | Categories aligned with SCRAP_CATEGORIES; marketplace category filter. |
| B.4 | Storefront category filter | ✅ | `?category=<handle>` on marketplace; CategoryFilter. |

No further work needed for “adding products” in the single-tenant sense; remaining is **who** adds them (admin vs seller) in Phase C.

---

### Phase C (adding products in a multi-seller world) – not done

| Step | Scope | Where | What to do |
|------|--------|------|------------|
| **C.1** | Seller-scoped product create | **b2b-medusa** | (1) Product create workflow (or API) that accepts `seller_id` (or infers from authenticated seller). (2) After product create, call `link.create` Product–Seller so the new product is linked to that seller. (3) Guard: only admin or the seller who owns that `seller_id` can create/link. Expose as Admin API (e.g. `POST /admin/products` with `seller_id`) or as a dedicated seller dashboard API (e.g. `POST /seller/products` with seller from auth). |
| **C.2** | Store API | ✅ | Already lists products with seller info; no change needed. |
| **C.3** | Bulk/import | **b2b-medusa** (optional) | CSV/import endpoint or job that creates products and links them to the authenticated seller (or admin-specified seller). |

So: **multiple sellers are fully “implemented” only after C.1 (and optionally C.3):** sellers (or admin on their behalf) can create products that are linked to the correct seller from the start.

---

### Later (from doc + timeline)

- **B2B (doc + timeline Phase 3):** Companies, approval, price lists, **Quote/RFQ** (request → response → order). **b2b-medusa:** B2B recipe + quote workflow; **b2b-medusa-storefront:** Request Quote, RFQ flow, quote acceptance → order.
- **Recycling domain (Phase 4):** Material taxonomy, grades, certifications, weight/units, fulfillment (pickup/delivery). **b2b-medusa:** Custom module or product attributes; **b2b-medusa-storefront:** filters and product detail fields.
- **Super admin (Phase 7):** Seller list in Admin, verification, disputes, platform reporting. **b2b-medusa:** Custom admin routes + UI or Medusa Admin extension.

These don’t change the multi-seller *plan*; they add B2B and recycling on top of the same seller model.

---

## 4. Concise “how it will be implemented” summary

- **Already implemented (codebase):**
  - **b2b-medusa:** Seller module, Product–Seller link, Store API (sellers, seller-by-product-ids, product-ids-by-seller), Admin API (sellers CRUD, link/unlink product–seller). Products are still created globally; linking is separate.
  - **b2b-medusa-storefront:** Marketplace with category + seller filters, “Sold by” on listing and product detail, data layer that tolerates missing seller routes.

- **To fully implement “multiple sellers” (so other sellers can use the platform):**
  1. **b2b-medusa – Auth & RBAC (A.3)**  
     User–Seller link, seller onboarding (invite or register), seller role, middleware so seller-scoped APIs only expose that seller’s data.
  2. **b2b-medusa – Seller-scoped product create (C.1)**  
     Create product and link to seller in one flow; allow only admin or the owning seller to create/link.
  3. **b2b-medusa – Optional Admin UI (A.6)**  
     Medusa Admin custom page: list/create sellers, assign products to seller (using existing APIs).
  4. **b2b-medusa-storefront (or separate app) – Seller dashboard (A.6)**  
     Seller login → list/create/edit own products, list own orders (and later RFQs when B2B exists). Calls backend seller-scoped and product-create APIs.

- **Optional storefront polish (A.5):**  
  Seller profile page: e.g. `/marketplace/seller/[handle]` using `getProductIdsBySellerHandle` + product list.

This is the plan for how multiple sellers are and will be implemented in `b2b-medusa` and `b2b-medusa-storefront`, aligned with the doc, timeline, CHECKLIST, and both plan files.

---

## 5. Implementation status – Seller Dashboard & Auth

### Backend (`b2b-medusa`) – implemented

- **Seller model updated:** Added `user_id` (nullable), `description` (nullable), `is_verified` (default false) to `src/modules/seller/models/seller.ts`. Run `npx medusa db:generate sellerModule` then `npx medusa db:migrate` to apply.
- **Auth middleware:** `src/api/middlewares.ts` – routes under `/store/sellers/me*` require customer auth (bearer/session).
- **`GET /store/sellers/me`** – returns the seller profile for the authenticated customer (by `user_id`), or `{ seller: null }` if not a seller.
- **`POST /store/sellers/me`** – registers the authenticated customer as a seller (creates Seller with `user_id`). Validates unique handle; idempotent (returns existing if already registered).
- **`GET /store/sellers/me/products`** – returns all products linked to the authenticated seller (via Product–Seller link and `query.graph`).
- **`POST /store/sellers/me/products`** – creates a product and auto-links it to the authenticated seller. Assigns to default sales channel. Accepts `title`, `description`, `handle`, `category_ids`, `variants` (with prices).

### Storefront (`b2b-medusa-storefront`) – implemented

- **Data layer:** `lib/data/seller-dashboard.ts` – `getMySellerProfile()`, `registerAsSeller()`, `getMyProducts()`, `createSellerProduct()`.
- **Server actions:** `lib/data/seller-actions.ts` – `registerSellerAction()`, `createProductAction()` (form-based, with cache revalidation).
- **Seller dashboard layout:** `app/[countryCode]/(main)/seller/layout.tsx` + `modules/seller/templates/seller-layout.tsx` – sidebar nav (Dashboard, Products, Add Product), shows login prompt if unauthenticated.
- **Dashboard page:** `/seller` – shows seller profile overview if registered, or "Become a Seller" registration form if not.
- **Products page:** `/seller/products` – lists seller's own products in a table (title, handle, status, date).
- **Add Product page:** `/seller/products/new` – form with title, handle, description, price (AED), SKU, category dropdown. Creates product + auto-links to seller.
- **Nav links:** "Sell" link added to header nav bar; "Seller Dashboard" added to mobile side menu.

### What to do from your side

1. **Backend:** Run `npx medusa db:generate sellerModule` then `npx medusa db:migrate` to apply the new columns.
2. **Test flow:**
   - Register a customer on the storefront (or use existing `test@test.com`).
   - Go to `/ae/seller` → "Become a Seller" form → register.
   - Go to `/ae/seller/products/new` → add a product → it appears on the marketplace with "Sold by [your seller name]".

---

## Not in scope (per plan.md)

- Full multi-vendor marketplace implementation
- CMS integration
- Advanced analytics dashboards
