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

## Not in scope (per plan.md)

- Full multi-vendor marketplace implementation
- CMS integration
- Advanced analytics dashboards
