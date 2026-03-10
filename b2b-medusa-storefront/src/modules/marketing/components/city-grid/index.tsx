type CityGridProps = {
  liveCities: readonly string[]
  comingSoonCities: readonly string[]
  className?: string
}

export default function CityGrid({
  liveCities,
  comingSoonCities,
  className = "",
}: CityGridProps) {
  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#0B3D2E] mb-2">
          Now serving
        </h3>
        <div className="flex flex-wrap gap-2">
          {liveCities.map((city) => (
            <span
              key={city}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-[#0B3D2E] font-medium text-sm"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          Coming soon
        </h3>
        <p className="text-slate-500 text-sm">
          {comingSoonCities.join(" • ")}
        </p>
      </div>
    </div>
  )
}
