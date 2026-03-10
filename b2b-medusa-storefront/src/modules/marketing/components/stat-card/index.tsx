type StatCardProps = {
  value: string
  unit?: string
  label: string
  className?: string
}

export default function StatCard({
  value,
  unit = "",
  label,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-2 ${className}`}
    >
      <p className="text-2xl md:text-3xl font-extrabold text-[#1FAF5A]">
        {value}
        {unit && <span className="text-lg font-semibold ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  )
}
