/**
 * Static blog posts for ScrapCircle.
 * Later can be replaced by CMS or markdown.
 */

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  body?: string
  tags?: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-scrap-is-the-new-resource",
    title: "Why scrap is the new resource",
    excerpt:
      "How circular supply chains turn everyday scrap into reliable secondary raw material.",
    date: "2024-01-15",
    body: `
Scrap is no longer just something to be thrown away. When it is sorted,
measured, and traced, it becomes a predictable stream of secondary raw
material for manufacturers and processors.

At ScrapCircle we connect the grassroots collectors who understand local
scrap flows with the businesses who need reliable material, closing the
loop one pickup at a time.
    `.trim(),
    tags: ["circular economy", "scrap"],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
