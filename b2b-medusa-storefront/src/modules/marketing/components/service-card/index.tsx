import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ServiceCardProps = {
  title: string
  description: string
  href: string
  linkLabel: string
  className?: string
}

export default function ServiceCard({
  title,
  description,
  href,
  linkLabel,
  className = "",
}: ServiceCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 space-y-4 ${className}`}
    >
      <h3 className="text-xl font-bold text-[#0B3D2E]">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      <LocalizedClientLink
        href={href}
        className="inline-flex text-sm font-semibold text-[#1FAF5A] hover:text-[#0B3D2E] transition-colors"
      >
        {linkLabel} →
      </LocalizedClientLink>
    </div>
  )
}
