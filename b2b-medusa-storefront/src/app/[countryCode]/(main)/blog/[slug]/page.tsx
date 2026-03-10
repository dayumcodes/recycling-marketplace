import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@lib/blog-data"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Blog | ScrapCircle",
    }
  }

  return {
    title: `${post.title} | ScrapCircle`,
    description: post.body.slice(0, 120),
  }
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params
  const post = getPostBySlug(params.slug)

  if (!post || !post.body) {
    notFound()
  }

  return (
    <div className="content-container py-16 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-lime-400 mb-3">
        Blog
      </p>
      <h1 className="text-3xl-semi text-slate-900 mb-2">{post.title}</h1>
      <p className="text-xs text-slate-500 mb-8">
        {new Date(post.date).toLocaleDateString()}
      </p>
      <div className="prose prose-slate max-w-none whitespace-pre-line">
        {post.body}
      </div>
    </div>
  )
}

