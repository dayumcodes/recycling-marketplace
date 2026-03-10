# Cursor Prompt: Full Architecture for a B2B Recycling Marketplace on Medusa

Use this prompt in Cursor when designing or building the system. Copy the entire section below the line.

---

## Project brief

Build a **B2B recycling marketplace** (inspired by platforms like Epicircle) that connects **sellers** (recyclers, scrap dealers, waste processors) with **buyers** (manufacturers, processors, businesses that need secondary raw materials). The stack must be **Medusa (v2)** for commerce and marketplace logic, with a focus on recycling-specific workflows, materials, and compliance.

**Core value proposition:** One business’s scrap becomes another’s raw material. The platform should maximize transparency, fair pricing, verified parties, and circular economy impact (diversion from landfill, traceability, reporting).

---

## High-level architecture

1. **Backend:** Medusa v2 backend (Node.js) with:
   - Standard commerce modules (Product, Order, Customer, Pricing, Sales Channel, Region, etc.)
   - **Custom marketplace module** so multiple **sellers (recyclers)** can list materials and fulfill orders; each seller has isolated products, orders, and optional store profile
   - **B2B extensions:** companies, approval flows, quotes/RFQ, price lists, bulk operations—applied in a recycling context (e.g. RFQ for bulk scrap by material/grade)
   - **Recycling domain module:** material taxonomy, grades, certifications, quantity/weight handling, and any compliance or reporting fields

2. **Frontend:**
   - **Buyer storefront:** Next.js (e.g. 14+) consuming Medusa Store API—browse materials by category/grade, request quotes, place orders, track pickups/deliveries
   - **Seller dashboard:** Next.js app (or Medusa Admin extension) for recyclers to manage listings, quotes, orders, and basic analytics
   - **Super admin:** Medusa Admin + custom screens for platform config, seller onboarding/verification, and reporting

3. **Integrations (design for):** weighing/lot management, logistics (pickup/delivery), payments (including escrow or split payouts if needed), and optional reporting (diversion, carbon, certificates).

---

## Actors and roles

- **Buyers:** Businesses (manufacturers, processors, traders) that need scrap or recycled materials. They browse listings, send RFQs, accept quotes, place orders, and receive materials (pickup or delivery).
- **Sellers (recyclers):** Scrap dealers, recyclers, processors who list materials (by type, grade, quantity), respond to RFQs, fulfill orders, and get paid.
- **Platform admin:** Onboarding/verification of sellers, catalog and category management, dispute handling, fees/commissions, and platform-wide reporting.

---

## Recycling-specific domain model

Design and implement a **recycling-aware** data and API layer on top of Medusa:

1. **Material taxonomy**
   - **Categories:** Metals (Copper, Steel, Aluminium, Brass, Tin, Iron), Plastics, Paper, Glass, E-waste, etc.
   - **Subcategories / grades:** e.g. plastic (PET, HDPE, LDPE), paper (OCC, mixed), metals (clean vs contaminated), e-waste (IT, appliances).
   - Map these to Medusa **Product Categories** and custom attributes (e.g. `material_type`, `grade`, `recycled_content`).

2. **Listings (products)**
   - Each listing is a **seller’s product** in the marketplace (linked to a seller/store).
   - Attributes: material type, grade, quantity (weight in kg/tons or volume), unit (kg, ton, bale, truckload), location/region, certifications (e.g. R2, e-Stewards for e-waste), photos, description.
   - Pricing: fixed price per unit, or “Request quote” for large/negotiable lots.
   - Availability: in stock / reserved / sold; optional lot/batch IDs for traceability.

3. **Quotes and RFQ**
   - Buyers can **request a quote** for a listing or for a custom need (material + grade + quantity + delivery terms).
   - Sellers respond with price, validity, and terms.
   - Use Medusa B2B **Quote** flow where possible; extend with recycling-specific fields (weight, grade, pickup/delivery, incoterms).

4. **Orders and fulfillment**
   - Order = buyer commits to a quoted or fixed-price listing; line items reference material, quantity, price, seller.
   - Fulfillment: **pickup** (buyer or third-party collects) or **delivery** (seller or logistics partner). Support fulfillment status: scheduled, picked up, in transit, delivered.
   - Optional: link to external logistics or weighing systems via webhooks/API.

5. **Certifications and compliance**
   - Sellers can attach certifications (R2, e-Stewards, ISO, etc.) to profile or to listings.
   - Optional: store certificates in asset storage and link to seller/listing; expose in API for buyer trust and reporting.

6. **Reporting and impact**
   - Derive from orders: weight diverted, material type, seller/buyer. Optional: CO2 equivalent saved, certificates used. Design for dashboards (seller, buyer, admin) and export (CSV/API).

---

## Buyer–seller connection flows

1. **Discovery:** Buyers browse or search by material, grade, location, certification. Filters and facets should use the recycling taxonomy.
2. **Quote request:** Buyer sends RFQ (from a listing or free-form). Sellers with matching capability receive and respond; platform notifies buyer.
3. **Negotiation (optional):** Accept/reject/modify quote (align with Medusa B2B quote workflow).
4. **Order:** Buyer accepts quote → order is created with correct seller, line items, and pricing. Payment and (if used) escrow/split logic run here.
5. **Fulfillment:** Seller marks pickup/delivery scheduled and completed; buyer confirms receipt. Disputes handled by admin.
6. **Settlement:** Platform fee (if any); remainder to seller. Design for future payment gateway and payout automation.

---

## Medusa-specific implementation notes

- **Marketplace:** Use the [Marketplace recipe](https://docs.medusajs.com/resources/recipes/marketplace) and/or a plugin (e.g. multi-store/vendor) so that:
  - Products and orders are **scoped to a seller** (store/vendor id).
  - Storefront shows aggregated catalog from all sellers with clear “sold by” and seller profile links.
  - Seller dashboard and API filters (e.g. `?store_id=`) restrict data to that seller.
- **B2B:** Use the [B2B recipe](https://docs.medusajs.com/resources/recipes/b2b): companies, approval limits, price lists, and **Quote/RFQ** workflows. Adapt “customer groups” to buyer segments (e.g. by volume or material focus).
- **Sales channels:** Consider a dedicated “B2B Recycling Marketplace” sales channel; control product visibility and pricing by channel.
- **Custom modules:** Implement a **RecyclingModule** (or extend Product/Customer) for: material type, grade, certifications, weight/quantity rules, and any compliance fields. Keep validation and reporting logic in one place.
- **Workflows:** Use Medusa workflows for: quote request → quote response → order creation; order placement → fulfillment creation; and (optional) post-delivery settlement.

---

## Tech stack summary

| Layer           | Technology / approach |
|----------------|------------------------|
| Commerce engine| Medusa v2 (backend)   |
| Marketplace    | Custom module + Marketplace recipe (or marketplace plugin) |
| B2B            | B2B recipe (companies, quotes, price lists) |
| Buyer storefront | Next.js 14+ (App Router), Medusa Store API, auth (NextAuth or Medusa auth) |
| Seller dashboard | Next.js app or Medusa Admin UI extensions, seller-scoped API |
| Admin          | Medusa Admin + custom pages (sellers, reporting, verification) |
| DB             | PostgreSQL (Medusa default) |
| Auth           | Medusa auth for customers; separate admin/seller roles and middleware |
| Optional       | File storage (S3) for certificates/images; Redis for cache/queues; webhooks for logistics/weighing |

---

## Deliverables to design or implement

1. **Architecture doc:** System context diagram, module boundaries, and data flow (buyer → platform → seller) for listing, RFQ, order, and fulfillment.
2. **Data model:** ER or schema for Medusa entities + custom tables (sellers/stores, material taxonomy, certifications, quote extensions).
3. **API contract:** Key store and admin API endpoints for listings, RFQ, quotes, orders, and seller-scoped operations.
4. **Recycling taxonomy:** Initial categories and grades (metals, plastics, paper, glass, e-waste) as seed data or config.
5. **User flows:** Wireframes or flow descriptions for: buyer (search → RFQ → order → receipt) and seller (list → respond to RFQ → fulfill → get paid).
6. **Security and compliance:** Seller verification, role-based access (buyer vs seller vs admin), and how certifications and sensitive data are stored and exposed.

---

## Success criteria

- Buyers can discover recyclers and materials by type/grade/location and request or accept quotes.
- Sellers can list materials with clear attributes (material, grade, quantity, certifications) and manage quotes and orders in their own scope.
- Orders flow from quote to fulfillment with clear status and (where applicable) pickup/delivery tracking.
- Platform is built on Medusa v2 with a clear path to B2B features (companies, approval, price lists) and multi-seller marketplace behavior.
- Recycling domain (materials, grades, certifications, weight, reporting) is first-class in the data model and APIs, not bolted on.

---

*Use this prompt when generating architecture docs, ADRs, database schemas, API specs, or implementation tasks for the B2B recycling marketplace on Medusa. Prioritize connecting buyers and sellers around recycling-specific listings, quotes, and orders while keeping the design modular and aligned with Medusa’s B2B and marketplace patterns.*
