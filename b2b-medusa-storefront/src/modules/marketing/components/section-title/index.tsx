import { ReactNode } from "react"

type SectionTitleProps = {
  eyebrow?: string
  heading: string
  description?: string
  className?: string
}

export default function SectionTitle({
  eyebrow,
  heading,
  description,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`max-w-3xl space-y-2 ${className}`}>
      {eyebrow && (
        <p className="uppercase text-xs tracking-[0.3em] text-[#1FAF5A]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D2E]">
        {heading}
      </h2>
      {description && (
        <p className="text-base text-slate-600 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
