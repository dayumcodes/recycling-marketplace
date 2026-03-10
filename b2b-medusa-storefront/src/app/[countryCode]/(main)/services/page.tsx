import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | ScrapCircle",
  description:
    "Discover scrap management solutions for residents, businesses, and large-scale generators.",
}

export default async function ServicesPage() {
  return (
    <div className="content-container py-16 space-y-12">
      <section className="max-w-3xl space-y-4">
        <p className="uppercase text-xs tracking-[0.3em] text-lime-400">
          Our Services
        </p>
        <h1 className="text-3xl-semi text-slate-900">
          B2B scrap solutions tailored to how you operate
        </h1>
        <p className="text-base-regular text-slate-700">
          Whether you&apos;re a household, a neighborhood association, a
          manufacturer, or a large campus, ScrapCircle gives you clear,
          accountable scrap flows and better economics.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-xl-semi text-slate-900">For Residents</h2>
          <p className="text-base-regular text-slate-700">
            Schedule doorstep pickups for paper, plastic, metal, glass, and
            e‑waste. Track what you&apos;ve diverted from landfill and redeem
            the value as rewards or payouts.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-xl-semi text-slate-900">
            For Businesses &amp; Organizations
          </h2>
          <p className="text-base-regular text-slate-700">
            Get predictable pickups, digital weight slips, and compliance‑ready
            reports that tie directly into your ESG and waste‑reduction goals.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-xl-semi text-slate-900">
            Commercial Scrap Removal
          </h2>
          <p className="text-base-regular text-slate-700">
            Clear out accumulated scrap from factories, warehouses, and
            commercial sites with vetted recyclers and transparent pricing.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-xl-semi text-slate-900">
            Large‑Scale Scrap Generators
          </h2>
          <p className="text-base-regular text-slate-700">
            Design recurring programs for malls, townships, and industrial
            parks with dedicated pickup slots, material segregation, and
            dashboards.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 md:col-span-2">
          <h2 className="text-xl-semi text-slate-900">
            B2B Recycling Marketplace
          </h2>
          <p className="text-base-regular text-slate-700">
            Connect verified scrap sellers and buyers on a single platform.
            Publish lots with material, grade, quantity, and location — and
            match them with manufacturers and processors who need secondary raw
            materials.
          </p>
        </div>
      </section>
    </div>
  )
}

