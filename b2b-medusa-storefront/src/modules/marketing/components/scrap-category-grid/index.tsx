import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Category = { name: string; slug: string }

type ScrapCategoryGridProps = {
  categories: readonly Category[]
  className?: string
}

export default function ScrapCategoryGrid({
  categories,
  className = "",
}: ScrapCategoryGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 ${className}`}
    >
      {categories.map((cat) => (
        <LocalizedClientLink
          key={cat.slug}
          href={`/marketplace?category=${cat.slug}`}
          className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-[#1FAF5A]/30 hover:shadow-md transition-all group"
        >
          <span className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-600 group-hover:text-[#1FAF5A] font-semibold text-sm">
            {cat.name.charAt(0)}
          </span>
          <span className="font-medium text-slate-800 group-hover:text-[#0B3D2E] text-sm">
            {cat.name}
          </span>
        </LocalizedClientLink>
      ))}
    </div>
  )
}
