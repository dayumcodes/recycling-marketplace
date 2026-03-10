import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CTASectionProps = {
  heading: string
  subheading?: string
  ctaLabel: string
  ctaHref: string
  className?: string
}

export default function CTASection({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  className = "",
}: CTASectionProps) {
  return (
    <section
      className={`py-16 bg-[#0B3D2E] rounded-2xl text-center px-6 ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {heading}
      </h2>
      {subheading && (
        <p className="text-xl text-emerald-200 mb-8">{subheading}</p>
      )}
      <LocalizedClientLink
        href={ctaHref}
        className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#1FAF5A] text-white font-semibold hover:bg-emerald-400 transition-colors"
      >
        {ctaLabel}
      </LocalizedClientLink>
    </section>
  )
}
