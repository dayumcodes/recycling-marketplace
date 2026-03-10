import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  { name: "Metal Scrap", count: "1,240" },
  { name: "Plastic Waste", count: "890" },
  { name: "Paper & Cardboard", count: "2,100" },
  { name: "E-Waste", count: "450" },
  { name: "Construction Debris", count: "320" },
  { name: "Industrial Byproducts", count: "150" },
]

const STATS = [
  { label: "Tons Recycled", value: "25,000+" },
  { label: "Transactions Secured", value: "12,000+" },
  { label: "Tons CO₂ Reduced", value: "18,000+" },
]

const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base bg-[#F3FDF6]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[720px] h-[720px] bg-emerald-100/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[520px] h-[520px] bg-teal-50/60 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="content-container relative z-10 grid gap-10 md:grid-cols-2 items-center">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#0B3D2E] text-xs font-semibold">
              B2B Circular Economy Platform
            </span>

            <Heading
              level="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#0B3D2E]"
            >
              Transform Waste into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF5A] to-teal-600">
                Value.
              </span>
            </Heading>

            <p className="text-xl text-slate-600 leading-relaxed">
              Connect directly with verified recyclers, scrap dealers, and bulk
              material buyers. Secure, transparent, and built on Medusa for
              scale.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <LocalizedClientLink
                href="/contact"
                className="bg-[#0B3D2E] hover:bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 text-center"
              >
                Sell Scrap
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/marketplace"
                className="bg-white border-2 border-slate-200 hover:border-[#1FAF5A] text-slate-700 hover:text-[#0B3D2E] px-8 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 text-center"
              >
                Buy Recyclables
              </LocalizedClientLink>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1FAF5A]/10 to-transparent rounded-3xl transform rotate-3 scale-105" />
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative z-10 transform -rotate-1 transition-transform duration-500 hover:rotate-0">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-semibold text-slate-800">
                  Recent Marketplace Activity
                </span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#1FAF5A] text-xs font-semibold">
                      20t
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        Shredded HDPE
                      </p>
                      <p className="text-xs text-slate-500">
                        Verified Seller • Mumbai
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0B3D2E]">$450/t</p>
                      <p className="text-xs text-emerald-500 font-medium">
                        Available
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-[#0B3D2E] py-10">
        <div className="content-container grid gap-8 text-center text-emerald-300 md:grid-cols-3 md:divide-x md:divide-emerald-800">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4">
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by material */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D2E] mb-3">
              Browse by Material
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
              Find exact specifications of industrial scrap and recyclables
              across our vetted network.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <LocalizedClientLink
                key={cat.name}
                href="/marketplace"
                className="group flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#1FAF5A]/40 hover:shadow-lg hover:shadow-emerald-100 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-500 group-hover:text-[#1FAF5A] text-sm font-semibold">
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-800 group-hover:text-[#0B3D2E]">
                    {cat.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {cat.count} active listings
                  </p>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
