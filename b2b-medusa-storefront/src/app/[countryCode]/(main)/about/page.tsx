import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | ScrapCircle",
  description:
    "Learn how ScrapCircle turns scrap into treasure by connecting households, businesses, and recyclers through technology.",
}

export default async function AboutPage() {
  return (
    <div className="content-container py-16 space-y-10">
      <section className="max-w-3xl space-y-4">
        <p className="uppercase text-xs tracking-[0.3em] text-lime-400">
          About Us
        </p>
        <h1 className="text-3xl-semi text-slate-900">
          Turning Scrap into Treasure
        </h1>
        <p className="text-base-regular text-slate-700">
          ScrapCircle is built for the new circular economy. We bridge the gap
          between households, businesses, municipalities, and grassroots
          collectors by tagging, tracing, and routing scrap to the places where
          it creates the most value.
        </p>
      </section>
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl-semi text-slate-900">Why we exist</h2>
          <p className="text-base-regular text-slate-700">
            In many cities, scrap moves through an informal yet vibrant
            ecosystem. Municipal systems, brands, and recyclers struggle to see
            what&apos;s really happening on the ground. We use data and
            logistics to make that ecosystem visible and reward the eco-warriors
            who power it.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl-semi text-slate-900">
            Tech for a scrap‑free future
          </h2>
          <p className="text-base-regular text-slate-700">
            From AI‑aided material classification to digital pickup routing and
            B2B recycling marketplaces, our platform is designed to slash
            landfill, lower emissions, and turn every kilogram of scrap into new
            opportunity.
          </p>
        </div>
      </section>
    </div>
  )
}

