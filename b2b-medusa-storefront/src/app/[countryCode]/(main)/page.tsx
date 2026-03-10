import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import {
  PillarCard,
  ServiceCard,
  CityGrid,
  TestimonialCard,
  CTASection,
} from "@modules/marketing/components"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import {
  PILLARS,
  SERVICES,
  CITIES,
  ABOUT_TEASER,
  IMPACT_NARRATIVE,
  TESTIMONIALS,
  BOTTOM_CTA,
} from "@lib/marketing-data"

export const metadata: Metadata = {
  title: "ScrapCircle | Transform Waste into Value",
  description:
    "B2B circular economy platform connecting recyclers, scrap dealers, and bulk material buyers. Secure, transparent, built for scale.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      {/* Three Pillars */}
      <section id="pillars" className="py-16 bg-white">
        <div className="content-container">
          <div className="mb-10">
            <p className="uppercase text-xs tracking-[0.3em] text-[#1FAF5A] mb-2">
              Our mission
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D2E]">
              We See Scrap As A Catalyst For Positive Change
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <PillarCard
                key={pillar.title}
                title={pillar.title}
                description={pillar.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-16 bg-[#F3FDF6]">
        <div className="content-container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B3D2E] mb-4">
            {ABOUT_TEASER.heading}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            {ABOUT_TEASER.body}
          </p>
          <LocalizedClientLink
            href={ABOUT_TEASER.ctaHref}
            className="inline-flex px-6 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-semibold hover:bg-slate-900 transition-colors"
          >
            {ABOUT_TEASER.ctaLabel}
          </LocalizedClientLink>
        </div>
      </section>

      {/* B2B Solutions */}
      <section id="services" className="py-16 bg-white">
        <div className="content-container">
          <div className="mb-10">
            <p className="uppercase text-xs tracking-[0.3em] text-[#1FAF5A] mb-2">
              For business
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D2E]">
              B2B Solutions Tailored for Your Business Needs
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                href={service.href}
                linkLabel={service.linkLabel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Impact narrative */}
      <section className="py-16 bg-slate-50">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-[#0B3D2E] mb-10 text-center">
            What Impact are we Creating?
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {IMPACT_NARRATIVE.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-6"
              >
                <h3 className="text-lg font-bold text-[#0B3D2E] mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-[#0B3D2E] mb-8 text-center">
            Pioneering a Scrap-Free India
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Transforming homes and cities, one step at a time.
          </p>
          <CityGrid
            liveCities={CITIES.live}
            comingSoonCities={CITIES.comingSoon}
            className="max-w-3xl mx-auto"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#F3FDF6]">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-[#0B3D2E] mb-8 text-center">
            What our clients say about ScrapCircle
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard
                key={t.name}
                name={t.name}
                role={t.role}
                quote={t.quote}
                tagline={t.tagline}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <CTASection
            heading={BOTTOM_CTA.heading}
            subheading={BOTTOM_CTA.subheading}
            ctaLabel={BOTTOM_CTA.ctaLabel}
            ctaHref={BOTTOM_CTA.ctaHref}
          />
        </div>
      </section>

      {/* Featured products (existing) */}
      <div className="py-12 bg-[#F3FDF6]">
        <div className="content-container">
          <h2 className="text-2xl font-bold text-[#0B3D2E] mb-6">
            Explore materials
          </h2>
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </div>
    </>
  )
}
