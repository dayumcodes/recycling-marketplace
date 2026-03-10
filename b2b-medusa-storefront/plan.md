### Vision

Turn the default **Medusa Next.js Starter** into a **scrap‑tech B2B recycling platform** inspired by [`epicircle.earth`](https://epicircle.earth/), while keeping:

- Medusa as the commerce engine (products, regions, pricing, orders).
- Next.js 15 + Tailwind for a fast, modern, marketing‑heavy frontend.

The site should feel like a **productized service + marketplace**, not a generic ecommerce store.

---

### Milestones Overview

1. **Foundation & Routing**
   - Define routes and page components.
   - Wire up navigation and layout.
2. **Theming & Design System**
   - Tailwind theme, layout shell, shared sections.
3. **Home Page (Marketing)**
   - Hero, pillars, B2B solutions, impact, cities, testimonials, scrap categories.
4. **Supporting Pages**
   - `/about`, `/services`, `/impact`, `/blog`, `/contact`.
5. **Marketplace Integration**
   - Map scrap categories to Medusa product categories.
   - `/marketplace` listing + product detail customization.
6. **Lead Capture & Contact Flows**
   - Contact form + “Request Quote” touchpoints.
7. **B2B & Marketplace Extensions (later)**
   - Company accounts, RFQs/quotes, multi‑vendor.

Each section below gives concrete implementation steps.

---

### 1. Information Architecture & Routing

**Goal:** Mirror the structure of [`epicircle.earth`](https://epicircle.earth/) and connect it to Medusa commerce flows.

#### 1.1 Routes to add

- `/` – Marketing home.
- `/about` – Story, mission, “Turning Scrap into Treasure”.
- `/services` – For Residents / For Businesses / Commercial Scrap / Large‑Scale / Marketplace.
- `/impact` – Environmental contribution, metrics, narratives.
- `/blog` – Blog index.
- `/blog/[slug]` – Blog post detail.
- `/contact` – Contact / lead form.
- `/marketplace` (or `/shop`) – Product listing backed by Medusa.

Existing Medusa routes (`/account`, `/cart`, `/checkout`, etc.) stay as–is.

#### 1.2 Implementation steps

1. Identify where routes live (likely `app/` directory in the starter).
2. For each new route, create a directory with `page.tsx`:
   - `app/about/page.tsx`
   - `app/services/page.tsx`
   - `app/impact/page.tsx`
   - `app/blog/page.tsx`
   - `app/blog/[slug]/page.tsx`
   - `app/contact/page.tsx`
   - `app/marketplace/page.tsx`
3. For now, use simple placeholder components; later phases will fill out content and design.

---

### 2. Theming, Layout, and Design System

**Goal:** Re‑skin the starter to feel like a scrap‑tech brand (dark/navy + green) with reusable building blocks.

#### 2.1 Tailwind theme

1. Open `tailwind.config.*` and:
   - Define primary colors (e.g. `primary`, `primary-foreground`, `accent`).
   - Set background (`bg-slate-*` / custom navy).
   - Configure font family (e.g. modern sans + secondary display font for headings).
2. Update `globals.css` to:
   - Set body background and text colors.
   - Add utility classes for section padding and vertical spacing.

#### 2.2 Global layout

1. Locate the root layout (e.g. `app/layout.tsx`) and header/footer components.
2. Update header:
   - Logo text (temporary): `ScrapCircle` / your brand name.
   - Nav items: `Home`, `About`, `Services`, `Impact`, `Marketplace`, `Blog`, `Contact`.
   - Right‑side CTA button: “Schedule Pickup” linking to `/contact`.
3. Update footer:
   - Columns:
     - **Company**: About, Impact, Careers (placeholder), Blogs, Contact.
     - **Our Services**: Trash to Treasure, Zero‑Waste Society, Commercial Scrap, Large‑Scale Generators, Recycling Marketplace.
     - **Site Info**: Disclaimer, Privacy Policy, Terms of Use, Cookie Policy.
     - **Contact**: Email, phone, city, social icons.
   - Copyright text similar to epiCircle, but with your company name.

#### 2.3 Shared components

Create a `components/marketing/` folder (or similar) with:

- `HeroSection`
- `SectionTitle` (eyebrow label + heading + optional description)
- `StatCard` (for impact metrics)
- `PillarCard` (Zero Waste, Sustainability, Circular Economy)
- `ServiceCard` (B2B services)
- `CityGrid` (list of cities)
- `ScrapCategoryGrid`
- `TestimonialCard`
- `CTASection`

Keep these components **dumb/presentational**, taking props for text, links, and icons.

---

### 3. Home Page: Sections and Content

**Goal:** Home page that closely mirrors [`epicircle.earth`](https://epicircle.earth/) while remaining your own copy and brand.

#### 3.1 Data model for home content

Create a `lib/marketing-data.ts` (or similar) exporting arrays/objects:

- `PILLARS` – Zero Waste / Sustainability / Circular Economy.
- `SERVICES` – Commercial Scrap Removal, Large‑Scale Scrap Generators, Recycling Marketplace.
- `CITIES` – Gurugram, Delhi, Noida, Jaipur, Chandigarh, Mohali, etc.
- `SCRAP_CATEGORIES` – Paper, Plastic, Aluminium, Steel, Copper, Iron, Tin, Brass, E‑waste, Glass Bottles (include slug that maps to Medusa categories).
- `IMPACT_STATS` – Scrap diverted, Water saved, Trees saved (start with zero / mock).
- `TESTIMONIALS` – Objects with `name`, `role`, `quote`, `tagline`.

This keeps content easy to tweak without touching layout code.

#### 3.2 Section breakdown for `/` (home)

Order:

1. **HeroSection**
   - Headline: variation of “It All Starts With Scrap & Lots Of Tech”.
   - Subcopy: 1–2 lines on connecting households, businesses, and recyclers.
   - Primary CTA: “Explore Solutions” (anchors down to services section).
   - Secondary CTA: “Schedule Pickup” (links to `/contact`).
2. **Three Pillars**
   - Use `PILLARS` data + `PillarCard` components in a 3‑column grid.
3. **About teaser**
   - Short paragraph summarizing the mission + “Know More” button (`/about`).
4. **B2B Solutions**
   - 3 service cards from `SERVICES` with icons.
   - Each card includes a link to either `/services` or `/marketplace` with appropriate filter.
5. **Impact metrics**
   - 3 `StatCard` components for scrap diverted, water saved, trees saved.
   - Implement basic animated counters using CSS or small React hook later.
6. **Impact narrative**
   - 3–4 subsections similar to “We See Scrap As A Catalyst For Positive Change”.
7. **Cities we operate in**
   - `CityGrid` with current and coming soon cities.
8. **Scrap categories**
   - `ScrapCategoryGrid` with category tiles.
   - Each tile links to `/marketplace?category=<slug>`.
9. **Testimonials**
   - 3–6 testimonials in a grid or simple slider (no heavy dependency needed initially).
10. **Bottom CTA**
    - “Put your SCRAP to Work – Convert it into TREASURE” with one strong CTA button.

Implement each section as a `<section>` inside `app/page.tsx`, composing the shared components and data.

---

### 4. Supporting Pages

**Goal:** Build out key static pages matching the structure and copy themes of [`epicircle.earth`](https://epicircle.earth/).

#### 4.1 `/about`

Content:

- “Turning Scrap into Treasure” hero.
- Paragraphs about:
  - Informal scrap ecosystem.
  - Gap between municipalities/corporations and grassroots stakeholders.
  - How your platform uses tech + AI for tagging, analysis, and low‑carbon logistics.
- Timeline / value pillars (optional).

Implementation:

- Create `app/about/page.tsx` using marketing components and new text blocks.

#### 4.2 `/services`

Sections:

- **For Residents** – simple copy on household scrap pickup, scheduling, incentives.
- **For Businesses & Organizations** – commercial scrap removal, reporting, compliance.
- **Large‑Scale Scrap Generators** – hotels, malls, manufacturing units, etc.
- **Recycling Marketplace for Businesses** – description of B2B marketplace.

Implementation:

- `app/services/page.tsx` with subsections and CTAs pointing to `/contact` and `/marketplace`.

#### 4.3 `/impact`

Sections:

- Reuse `IMPACT_STATS` and expand with:
  - Stories/case studies.
  - Environmental excellence and circular economy narrative.

Implementation:

- `app/impact/page.tsx` using `StatCard` and simple text sections.

#### 4.4 `/blog` and `/blog/[slug]`

Phase 1:

- Static array of blog posts in `lib/blog-data.ts` (title, slug, excerpt, content, date, tags).
- `/blog` page lists posts.
- `/blog/[slug]` finds post by slug and displays content.

Later:

- Optionally move to CMS or markdown file–based content.

#### 4.5 `/contact`

Form fields:

- Full Name (required).
- Phone Number (required).
- City of Pickup (select list of cities + “Others”).
- How shall we address you? (Residential / Manufacturer / Workshop owner / Recycler / Others).
- How soon you want to sell? (Immediately / Within 7 days / Within 10 days).
- Message / Requirements (textarea).

Implementation:

- `app/contact/page.tsx` with a controlled form.
- For now, submit to a Next.js **server action or API route** that:
  - Logs data to console or stores in a simple table (TBD).
  - Returns a success/failure message on the page.

---

### 5. Marketplace Integration (Medusa)

**Goal:** Connect scrap categories and B2B messaging to the existing Medusa catalog and checkout.

#### 5.1 Medusa catalog setup

Actions in Medusa Admin:

1. Under **Products → Categories**, create categories:
   - `paper`, `plastic`, `aluminium`, `steel`, `copper`, `iron`, `tin`, `brass`, `e-waste`, `glass-bottles`.
2. Create example products under each category:
   - Use fields like title, description, price per unit (kg/ton), and variants as needed.
3. Ensure products are assigned to the correct Region and Sales Channel.

#### 5.2 `/marketplace` page

Implementation:

1. Create `app/marketplace/page.tsx`.
2. Use the Medusa JS SDK or existing data hooks from the starter to:
   - Fetch products.
   - Accept optional `category` query param to filter.
3. UI:
   - Filters sidebar (categories, maybe location or price range later).
   - Product grid with cards showing:
     - Material type / category.
     - Grade (if modeled in product metadata).
     - Location (metadata).
     - Price per unit or “Request quote”.

#### 5.3 Product detail tweaks

Locate existing product detail page (`app/products/[handle]/page.tsx` or similar) and:

- Adjust content layout to surface:
  - Material type & grade.
  - Quantity / unit.
  - Location of material.
  - Certifications (if stored in metadata).
- Add a **“Request Quote”** button that:
  - For now, links to `/contact?product=<id>` and pre‑fills message with product info.
  - Later can integrate with Medusa B2B quote/RFQ features.

---

### 6. Lead Capture & CTAs

**Goal:** Ensure marketing pages drive leads and quote requests, not only direct cart checkouts.

#### 6.1 CTA mapping

- Hero CTAs: “Explore Solutions” → `/services`, “Schedule Pickup” → `/contact`.
- B2B services section: each card → `/contact?type=business`.
- Scrap category tiles: click → `/marketplace?category=<slug>`.
- Product detail: “Request Quote” → `/contact?product=<id>`.

#### 6.2 Contact submission handling

Phase 1:

- Store submission in a simple JSON file, log, or in memory (local dev).

Phase 2 (later):

- Configure:
  - Email sending (e.g. Nodemailer).
  - Or write submissions into Medusa via custom module / table or external CRM.

---

### 7. Content Management Strategy

**Goal:** Keep v1 simple while allowing easy text and structure changes.

Approach:

- Use TypeScript data modules (`lib/marketing-data.ts`, `lib/blog-data.ts`).
- No external CMS in v1.
- Document where to update:
  - Navigation labels and links.
  - Hero text and CTAs.
  - Pillar descriptions and B2B copy.
  - City lists and impact metrics.
  - Testimonials and blog posts.

Later, consider:

- Swapping static data for CMS queries (Sanity, Contentful, etc.).

---

### 8. Development Phases & Checklist

#### Phase 1 – Skeleton & Theming

- [x] Define routes and create empty pages (`/`, `/about`, `/services`, `/impact`, `/blog`, `/blog/[slug]`, `/contact`, `/marketplace`).
- [x] Update header and footer navigation and style.
- [x] Configure Tailwind theme (colors, fonts) and base layout.

#### Phase 2 – Home & Core Marketing

- [x] Implement `HeroSection` + CTAs.
- [x] Add pillars, about teaser, B2B services, impact metrics, cities, scrap categories, testimonials, and bottom CTA.
- [x] Wire homepage components to data in `lib/marketing-data.ts`.

#### Phase 3 – Supporting Pages

- [x] Build `/about` content.
- [x] Build `/services` with resident vs business flows.
- [x] Build `/impact` metrics and narrative.
- [x] Implement `/blog` and `/blog/[slug]` with static data.
- [x] Implement `/contact` form and basic submission handling.

#### Phase 4 – Marketplace Integration

- [ ] Configure categories and products in Medusa Admin to match scrap taxonomy.
- [ ] Implement `/marketplace` listing with category filtering.
- [x] Customize product detail page for recycling context.
- [x] Add “Request Quote” flows linking to `/contact`.

#### Phase 5 – B2B & Marketplace Enhancements (optional)

- [ ] Explore Medusa B2B features (companies, quotes, price lists).
- [ ] Design RFQ/quote flows for large scrap volumes.
- [ ] Plan multi‑vendor support and seller dashboards.

---

### 9. Non‑Goals for v1

- Full multi‑vendor marketplace implementation (can be added later).
- Complex CMS integration.
- Advanced analytics dashboards.

The initial focus is a **high‑quality marketing + catalog experience** that clearly communicates the scrap‑tech vision and lets businesses explore offerings and reach out for quotes.

