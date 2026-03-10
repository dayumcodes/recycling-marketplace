import type { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BLOG_POSTS } from "@lib/blog-data"

export const metadata: Metadata = {
  title: "Blog | ScrapCircle",
  description:
    "Stories and insights from the frontlines of the circular economy and scrap management.",
}

export default async function BlogIndexPage() {
  return (
    <div className="content-container py-16 space-y-8">
      <section className="max-w-3xl space-y-4">
        <p className="uppercase text-xs tracking-[0.3em] text-lime-400">
          Blog
        </p>
        <h1 className="text-3xl-semi text-slate-900">
          Ideas from the circular economy
        </h1>
        <p className="text-base-regular text-slate-700">
          Learn how businesses, residents, and recyclers are redesigning waste
          into value.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <h2 className="text-xl-semi text-slate-900">{post.title}</h2>
            <p className="text-base-regular text-slate-700">{post.excerpt}</p>
            <LocalizedClientLink
              href={`/blog/${post.slug}`}
              className="text-sm font-medium text-lime-400 hover:text-lime-300"
            >
              Read more
            </LocalizedClientLink>
          </article>
        ))}
      </section>
    </div>
  )
}

