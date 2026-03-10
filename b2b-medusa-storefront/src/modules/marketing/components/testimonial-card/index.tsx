type TestimonialCardProps = {
  name: string
  role?: string
  quote: string
  tagline?: string
  className?: string
}

export default function TestimonialCard({
  name,
  role,
  quote,
  tagline,
  className = "",
}: TestimonialCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className}`}
    >
      <p className="text-slate-700 text-sm leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
      {tagline && (
        <p className="text-xs font-medium text-[#1FAF5A] mb-2">{tagline}</p>
      )}
      <p className="font-semibold text-slate-900">{name}</p>
      {role && <p className="text-xs text-slate-500">{role}</p>}
    </div>
  )
}
