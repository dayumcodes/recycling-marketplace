import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impact | ScrapCircle",
  description:
    "See how ScrapCircle helps divert scrap from landfills and powers a circular economy.",
}

const IMPACT_STATS = [
  { label: "Scrap diverted from landfill", value: "0 kg" },
  { label: "Water saved", value: "0 L" },
  { label: "Trees saved", value: "0" },
]

export default async function ImpactPage() {
  return (
    <div className="content-container py-16 space-y-12">
      <section className="max-w-3xl space-y-4">
        <p className="uppercase text-xs tracking-[0.3em] text-lime-400">
          Impact
        </p>
        <h1 className="text-3xl-semi text-slate-900">
          Measuring the change scrap can make
        </h1>
        <p className="text-base-regular text-slate-700">
          Every pickup, every marketplace transaction, and every kilogram of
          material we move is tracked so that cities, businesses, and residents
          can see their contribution to a scrap‑free future.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {IMPACT_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2"
          >
            <p className="text-2xl-semi text-lime-400">{stat.value}</p>
            <p className="text-small-regular text-slate-600">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl-semi text-slate-900">
            Uplifting eco‑warriors
          </h2>
          <p className="text-base-regular text-slate-700">
            We partner with local scrap collectors, kabadiwalas, and recyclers,
            bringing them into formal supply chains with better visibility,
            payouts, and safety.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl-semi text-slate-900">
            Powering greener cities
          </h2>
          <p className="text-base-regular text-slate-700">
            Optimized routing, material traceability, and digital reporting help
            cities reduce landfill dependency and meet sustainability targets
            faster.
          </p>
        </div>
      </section>
    </div>
  )
}

