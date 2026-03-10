type PillarCardProps = {
  title: string
  description: string
  className?: string
}

export default function PillarCard({
  title,
  description,
  className = "",
}: PillarCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#1FAF5A]/20 transition-all ${className}`}
    >
      <h3 className="text-xl font-bold text-[#0B3D2E] mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
